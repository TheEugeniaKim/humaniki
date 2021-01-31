import React, { useState, useEffect } from "react";
import Select from "react-select";
import WorldMap from "../Components/WorldMap";
import GenderTable from "../Components/GenderTable";
import preMapData from "../Components/custom.geo.json";
import { Col, Row, InputGroup, Form, Container } from "react-bootstrap";
import { propTypes } from "react-bootstrap/esm/Image";
import {
  filterMetrics,
  populations,
  createColumns,
  formatDate,
  errorDiv,
  loadingDiv,
  QIDs,
  keyFields,
  genderColorsMap
} from "../utils.js";

import PopulationToggle from "../Components/PopulationToggler";
import { ValueContainer } from "../Components/LimitedMultiSelect";

function GenderByCountryView({ API, snapshots }) {
  let makeCountryFilterFn = (selectedCountries) => (metric) => {
    const selectedCountriesValues = selectedCountries.map(
      (country) => country.value
    );
    console.log(
      "selected Countries:",
      selectedCountries,
      "metrics:",
      metric,
      "filter",
      selectedCountriesValues.includes(metric.item.citizenship)
    );

    return selectedCountriesValues.includes(metric.item.citizenship);
  };
  const [allMetrics, setAllMetrics] = useState(null);
  const [allMeta, setAllMeta] = useState(null);
  const [allCountries, setAllCountries] = useState([]);
  const [population, setPopulation] = useState(populations.GTE_ONE_SITELINK);
  const [mapData, setMapData] = useState(null);
  const [tableColumns, setTableColumns] = useState([{}]);
  const [tableArr, setTableArr] = useState([]);
  const [snapshot, setSnapshot] = useState("latest");
  const [tableMetaData, setTableMetaData] = useState({});
  const [property, setProperty] = useState("female");
  const [genders, setGenders] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isErrored, setIsErrored] = useState(false);

  function handleSnapshotChange(e) {
    setSnapshot(e.target.value);
  }

  function handleHumanChange(event) {
    setIsLoading(true);
    setPopulation(event);
  }

  function createMultiSelectData(metrics) {
    const multiSelectData = [];
    metrics.forEach((country) => {
      if (country.item_label.citizenship) {
        return multiSelectData.push({
          label: country.item_label.citizenship,
          value: country.item.citizenship,
        });
      }
    });
    return multiSelectData;
  }

  function processTableData(meta, metrics) {
    let tableArr = [];
    let genders = Object.values(meta.bias_labels).map((gender) => {
      return {
        value: gender,
        label: gender,
      };
    });
    const extrema = {
      totalMax: Number.NEGATIVE_INFINITY,
      totalMin: Number.POSITIVE_INFINITY,
    };

    metrics.forEach((obj, index) => {
      // Handle Formatting Table Data
      let tableObj = {};
      tableObj.key = index;
      tableObj.country = obj.item_label.citizenship;
      tableObj.total = Object.values(obj.values).reduce((a, b) => a + b);
      tableObj.sumOtherGenders = 0;
      for (let genderId in meta.bias_labels) {
        let label = meta.bias_labels[genderId]
          ? meta.bias_labels[genderId]
          : genderId;
        tableObj[label] = obj["values"][genderId] ? obj["values"][genderId] : 0;
        tableObj[label + "Percent"] = obj["values"][genderId]
          ? (obj["values"][genderId] / tableObj["total"]) * 100
          : 0;
        if (genderId !== "6581097" && genderId !== "6581072") {
          tableObj.sumOtherGenders += obj["values"][genderId]
            ? obj["values"][genderId]
            : 0;
        }
      }
      tableObj.sumOtherGendersPercent =
        (tableObj.sumOtherGenders / tableObj.total) * 100;
      if (tableObj.country) {
        tableArr.push(tableObj);
      }

      setTableArr(tableArr);
      setTableMetaData(extrema);
      setGenders(genders);
    });
  }

  function processMapData(meta, metrics) {
    // todo: if properties exist don't need to re-calculate except if snapshot changes (another argument to tell us to recalculate)
    console.log("SELECTED COUNTRIES:", selectedCountries);
    const selectedCountryQIDs = selectedCountries
      ? selectedCountries.map((country) => country.value)
      : [];
    const anySelectedCountryQIDs = selectedCountryQIDs.length > 0;
    for (let i = 0; i < preMapData.features.length; i++) {
      preMapData.features[i]["properties"]["isSelected"] = false;
      //set isSelected to false by default
      for (let j = 0; j < metrics.length; j++) {
        // check for iso code match
        // break out of j loop once found
        // set isSelected to true
        // if found set gender totals
        if (
          metrics[j]["item_label"]["iso_3166"] ===
          preMapData.features[i]["properties"]["iso_a2"]
        ) {
          // if there aren't any selectedCountries we're setting evertying to selected (Default all Selected)
          if (anySelectedCountryQIDs) {
            preMapData.features[i]["properties"][
              "isSelected"
            ] = selectedCountryQIDs.includes(metrics[j]["item"]["citizenship"])
              ? true
              : false;
          } else {
            // there are no selectedCountries so turn all countries selected
            preMapData.features[i]["properties"]["isSelected"] = true;
          }
          preMapData.features[i]["properties"]["total"] = Object.values(
            metrics[j]["values"]
          ).reduce((a, b) => a + b);
          preMapData.features[i]["properties"]["genders"] = Object.values(
            meta.bias_labels
          );
          let countryName = preMapData.features[i]["properties"]["name"];
          let femaleQuantity = 0;
          let maleQuantity = 0;
          let sumOtherQuantity = 0;
          let total = 0;

          for (let genderId in meta.bias_labels) {
            let label = meta.bias_labels[genderId];
            let quant = metrics[j]["values"][genderId]
              ? metrics[j]["values"][genderId]
              : 0;
            if (genderId === QIDs.female) {
              femaleQuantity = quant;
            } else if (genderId === QIDs.male) {
              maleQuantity = quant;
            } else {
              sumOtherQuantity += quant;
            }
            total += quant;
            preMapData.features[i]["properties"][label] = metrics[j]["values"][
              genderId
            ]
              ? metrics[j]["values"][genderId]
              : 0;
            preMapData.features[i]["properties"][label + "Percent"] = metrics[
              j
            ]["values"][genderId]
              ? (
                  (metrics[j]["values"][genderId] /
                    preMapData.features[i]["properties"]["total"]) *
                  100
                ).toFixed(3)
              : 0;
          }
          preMapData.features[i]["properties"]["text"] = `
            ${countryName}:
            Male: ${(femaleQuantity / total) * 100}%
            Female: ${(maleQuantity / total) * 100}%
            ∑ Other Genders: ${(sumOtherQuantity / total) * 100}% 
          `;
          break;
        }
      }
    }
    setMapData(preMapData);
  }

  function filterAndCreateVizAndTable(meta, metrics) {
    const countryFilterFn = selectedCountries
      ? makeCountryFilterFn(selectedCountries)
      : (metric) => true;
    const filteredMetrics = filterMetrics(metrics, countryFilterFn);

    setTableColumns(createColumns(meta, filteredMetrics, "country"));
    processMapData(meta, metrics);
    processTableData(meta, filteredMetrics);
  }

  function processAPIData(err, fetchData) {
    if (err) {
      console.log("ERROR:", err);
      setIsErrored(true);
    } else {
      setAllMetrics(fetchData.metrics);
      setAllMeta(fetchData.meta);
      let multiSelectData = createMultiSelectData(fetchData.metrics);
      setAllCountries(multiSelectData);
      filterAndCreateVizAndTable(fetchData.meta, fetchData.metrics);
    }
    setIsLoading(false);
    return true;
  }
  // ReFetch useEffect:
  useEffect(() => {
    API.get(
      {
        bias: "gender",
        metric: "gap",
        snapshot: snapshot,
        population: population,
        property_obj: { citizenship: "all", label_lang: "en" },
      },
      processAPIData
    );
  }, [population, snapshot]);

  // ReFilter useEffect:
  useEffect(() => {
    if ((allMeta, allMetrics)) {
      filterAndCreateVizAndTable(allMeta, allMetrics);
    }
  }, [selectedCountries]);

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }

  const snapshotsDropdownOptions = snapshots ? (
    <div>
      <Form.Label>Snapshot (YYYY-DD-MM)</Form.Label>
      <Form.Control
        as="select"
        onChange={handleSnapshotChange}
        value={snapshot ? snapshot : "latest"}
      >
        {snapshots.map((snapshot, index) => (
          <option key={snapshot.id}>
            {index === 0
              ? formatDate(snapshot.date) + " (latest)"
              : formatDate(snapshot.date)}
          </option>
        ))}
      </Form.Control>
    </div>
  ) : (
    <div> snapshots loading </div>
  );

  return (
    <div className="view-container">
      <h2 className="heading-left">Gender Gap By Country</h2>
      <PopulationToggle handleToggle={handleHumanChange} />
      <h5>
        Percentage of biographies and other content of women based on country of
        citizenship
      </h5>

      <p>
        This plot shows the percentage of biographies and other content of
        women, men, and other genders based on country of citizenship determined
        by the citizenship property in Wikidata. We represent data only for
        official as of December 2020. Note: As for January, 2016, only about 30%
        of biographies had place of birth, so this data is incomplete.
      </p>

      <Row className="justify-content-md-center">
        <Col lg={8}>
          <WorldMap
            mapData={mapData}
            property={property}
            extrema={tableMetaData}
            genders={genders}
          />
        </Col>
        <Col sm={4}>
          {snapshotsDropdownOptions}
          <h6>Gender:</h6>
          <Select 
            options={genders} onChange={(e) => setProperty(e.value)} 
            placeholder={"female"} 
          />
          <h6>Countries: </h6>
          <Select
            options={[{ label: "All", value: "*" }, ...allCountries]}
            isMulti
            isClearable={true}
            onChange={setSelectedCountries}
          />
        </Col>
      </Row>

      <div className="table-container">
        {isLoading ? loadingDiv : null}
        {isErrored ? errorDiv : null}
        <GenderTable 
          tableArr={tableArr} 
          tableColumns={tableColumns} 
          keyField={keyFields.country}
        />
      </div>
    </div>
  );
}

export default GenderByCountryView;
