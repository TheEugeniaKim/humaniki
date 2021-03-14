import React, { useState, useEffect } from "react";
import WorldMap from "../Components/WorldMap";
import GenderTable from "../Components/GenderTable";
import PopulationToggle from "../Components/PopulationToggler";
import RadialBarChart from "../Components/RadialBarChart";
import SelectDropdown from "../Components/SelectDropdown";
import ErrorDiv from "../Components/ErrorDiv";
import HoverTooltip from "../Components/HoverTooltip";
import Licensing from "../Components/Licensing";
import preMapData from "../Components/custom.geo.json";
import { Col, Row, Form } from "react-bootstrap";
import { propTypes } from "react-bootstrap/esm/Image";
import {
  filterMetrics,
  populations,
  createColumns,
  formatDate,
  loadingDiv,
  QIDs,
  keyFields,
  MultiValue,
  ValueContainer,
  Option,
  animatedComponents,
} from "../utils.js";

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
  const [snapshotDisplay, setSnapshotDisplay] = useState();
  const [completeness, setCompleteness] = useState();
  const [tableMetaData, setTableMetaData] = useState({});
  const [property, setProperty] = useState("female");
  const [genders, setGenders] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isErrored, setIsErrored] = useState(false);

  function handleSnapshotChange(e) {
    let date = e.target.value;
    if (date.slice(11, 20) === "(latest)") {
      date = date.slice(0, 10);
    }
    setSnapshot(date.replace(/-+/g, ""));
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
        if (genderId !== QIDs.male && genderId !== QIDs.female) {
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
      setIsErrored(err);
    } else {
      setAllMetrics(fetchData.metrics);
      setAllMeta(fetchData.meta);
      setCompleteness(fetchData.meta.coverage);
      setSnapshotDisplay(fetchData.meta.snapshot);
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
      <Form.Label>Snapshot</Form.Label>
      <Form.Control
        as="select"
        onChange={handleSnapshotChange}
        value={formatDate(snapshot)}
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
    <div className="viz-container country-view sub-container">
      <div className="viz-description">
        <h5>Gender Gap By Country</h5>
        <p>
          This plot shows the percentage of biographies and other content of
          female, male, and other genders based on country of citizenship
          determined by the citizenship property in Wikidata.
        </p>
      </div>
      <PopulationToggle handleToggle={handleHumanChange} />
      <Row className="justify-content-md-center">
        <Col lg={7}>
          <div className="viz-heading">
            <p className="viz-timestamp">All time, as of {snapshotDisplay}</p>
            <div>
              <HoverTooltip view={"country"} className="above-graph-icon" />
            </div>
          </div>

          {isLoading ? loadingDiv : null}
          {isErrored ? <ErrorDiv errors={isErrored} /> : null}

          <WorldMap
            mapData={mapData}
            property={property}
            extrema={tableMetaData}
            genders={genders}
          />
        </Col>
        <Col sm={3}>
          <Row className="completeness">
            <div className="completeness-child explanation">
              <div className="form-label">Data Completeness</div>
              <div className="form-label-subfield">Gender By Country</div>
              <p>
                % of humans that have citizenship data avaialble on Wikidata
              </p>
            </div>
            <div className="completeness-child chart">
              {completeness ? (
                <RadialBarChart data={[completeness, 1 - completeness]} />
              ) : null}
            </div>
          </Row>

          {snapshotsDropdownOptions}
          <div className="form-dropdown-group">
            <div className="form-label"> Gender:</div>
            <SelectDropdown
              options={genders}
              onChange={(e) => setProperty(e.value)}
              placeholder={"female"}
              allowSelectAll={false}
            />
            <div className="form-label"> Countries:</div>
            <SelectDropdown
              options={allCountries}
              isMulti
              hideSelectedOptions={true}
              isClearable={true}
              components={{
                Option,
                MultiValue,
                ValueContainer,
                animatedComponents,
              }}
              onChange={setSelectedCountries}
              allowSelectAll={false}
            />
          </div>
        </Col>
      </Row>
      <Licensing />
      <div className="table-container">
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
