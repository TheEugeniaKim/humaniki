import React, { useState, useEffect } from "react";
import {
  InputGroup,
  FormControl,
  Form,
  Container,
  Col,
  Row,
} from "react-bootstrap";
import PopulationToggle from "../Components/PopulationToggler";
import LineChart from "../Components/LineChart";
import GenderTable from '../Components/GenderTable';

import {
  filterMetrics,
  createColumns,
  formatDate,
  populations,
  percentFormatter, 
  errorDiv, 
  loadingDiv
} from "../utils";
import { toast } from "react-toastify";

function GenderByDOBView({ API, snapshots }) {
  const currYear = new Date().getFullYear();
  let makeYearFilterFn = (yearStart, yearEnd) => (metric) => {
    // this is a higher order function that will be predicate of each individual metric
    // is metric.item
    const metricYear = parseInt(metric.item.date_of_birth);
    // console.log("in make year filter fun", yearStart, metricYear, yearEnd)
    return yearStart <= metricYear && metricYear <= yearEnd;
  };
  const [allMetrics, setAllMetrics] = useState(null);
  const [allMeta, setAllMeta] = useState(null);
  const [genderMap, setGenderMap] = useState({});
  const [lineData, setLineData] = useState([]);
  const [tableMetaData, setTableMetaData] = useState({});
  const [tableColumns, setTableColumns] = useState([]);
  const [tableArr, setTableArr] = useState([]);
  const [graphGenders, setGraphGenders] = useState({});
  const [yearStart, setYearStart] = useState(1600);
  const [yearEnd, setYearEnd] = useState(currYear);
  const [snapshot, setSnapshot] = useState(null);
  const [population, setPopulation] = useState(populations.GTE_ONE_SITELINK);
  const [isLoading, setIsLoading] = useState(true);
  const [isErrored, setIsErrored] = useState(false);

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }

  function handleChange(e) {
    console.log("Handle Change", e);
    if (!lineData) {
    }
  }

  function handleHumanChange(e) {
    console.log("Handle Population Change,", e);
    setIsLoading(true);
    setPopulation(e);
  }

  function handleSnapshotChange(e) {
    setSnapshot(e.target.value);
  }

  function handleYearStart(e) {
    const year = parseInt(e.target.value);
    if (isNaN(year)) {
      toast("Please Enter Numeric Year");
      setYearStart(1600);
    } else {
      setYearStart(year);
    }
  }

  function handleYearEnd(e) {
    const year = parseInt(e.target.value);
    if (isNaN(year)) {
      toast("Please Enter Numeric Year");
      setYearEnd(currYear);
    } else {
      setYearEnd(year);
    }
  }

  function formatYear(num) {
    if (num > 0) {
      return num.toString() + " CE";
    } else {
      return (num * -1).toString() + " BCE";
    }
  }

  function createLineData(meta, metrics) {
    const lineData = [];
    //line data loop
    for (let genderId in meta.bias_labels) {
      let genderLine = {};
      genderLine.name = genderId;
      genderLine.values = [];
      metrics.forEach((dp) => {
        if (Object.keys(dp.values).includes(genderId)) {
          let tupleObj = {
            year: +dp.item_label.date_of_birth,
            value: dp["values"][genderId],
          };
          genderLine.values.push(tupleObj);
        }
      });
      lineData.push(genderLine);
    }
    return lineData;
  }

  function createTableArr(meta, metrics) {
    const tableArr = [];
    const extrema = {
      percentMax: Number.NEGATIVE_INFINITY,
      percentMin: Number.POSITIVE_INFINITY,
      totalMax: Number.NEGATIVE_INFINITY,
      totalMin: Number.POSITIVE_INFINITY,
    };
    metrics.forEach((dp, index) => {
      let tableObj = {};
      tableObj.key = index;
      tableObj.sortValue = parseInt(dp.item_label.date_of_birth);
      tableObj.year = formatYear(parseInt(dp.item_label.date_of_birth));
      tableObj.total = Object.values(dp.values).reduce((a, b) => a + b);
      tableObj.sumOtherGenders = 0;
      for (let genderId in meta.bias_labels) {
        let label = meta.bias_labels[genderId];
        tableObj[label] = dp["values"][genderId] ? dp["values"][genderId] : 0;
        tableObj[label + "Percent"] = dp["values"][genderId]
          ? (dp["values"][genderId] / tableObj["total"]) * 100
          : 0;
        console.log(
          "other genders arr",
          Object.keys(meta.bias_labels).filter(
            (id) => id !== "6581097" && id !== "6581072"
          )
        );
        if (genderId !== "6581097" && genderId !== "6581072") {
          tableObj.sumOtherGenders += dp["values"][genderId]
            ? dp["values"][genderId]
            : 0;
        }
      }
      tableObj.sumOtherGendersPercent =
        (tableObj.sumOtherGenders / tableObj.total) * 100;
      tableArr.push(tableObj);

      if (tableObj.womenPercent > extrema.percentMax) {
        extrema.percentMax = tableObj.womenPercent;
      } else if (tableObj.womenPercent < extrema.percentMin) {
        extrema.percentMin = tableObj.womenPercent;
      }
      if (tableObj.total > extrema.totalMax) {
        extrema.totalMax = tableObj.total;
      } else if (tableObj.total < extrema.totalMin) {
        extrema.totalMin = tableObj.total;
      }
      // console.log("Table Obj", tableObj)
    });
    return [tableArr, extrema];
  }

  function filterAndCreateVizAndTable(meta, metrics) {
    const yearFilterFn = makeYearFilterFn(yearStart, yearEnd);
    // const filteredMetrics = metrics // TODO: actually filter metrics
    console.log("Length of prefilter input is ,", metrics.length);
    const filteredMetrics = filterMetrics(metrics, yearFilterFn);
    console.log("Length of postfilter input is ,", filteredMetrics.length);
    // Here is genderFilter metrics
    // make fn in utils that will filter metrics by gender
    // const genderFilterMetricsApplied =
    // const genderFilterMetrics = genderFilterMetrics()

    let tableArr, extrema;
    [tableArr, extrema] = createTableArr(meta, filteredMetrics);
    setTableArr(tableArr);
    setTableMetaData(extrema);
    setGenderMap(meta.bias_labels);
    setGraphGenders(Object.values(meta.bias_labels));
    setLineData(createLineData(meta, filteredMetrics));
    setTableColumns(createColumns(meta, filteredMetrics, "year"));
  }

  function processData(err, data) {
    if (err) {
      setIsErrored(true);
      console.error("Error is", err);
    } else {
      console.log("DATA METRICS", data.metrics);
      setAllMetrics(data.metrics);
      setAllMeta(data.meta);
      filterAndCreateVizAndTable(data.meta, data.metrics);
    }
    setIsLoading(false);
    return true;
  }

  const columnFilters = (meta) => {
    let columnFilters = []
    for (let genderId in meta.bias_labels) {
        if (genderId !=="6581097" && genderId !=="6581072"){

            let obj = {
                dataField: meta.bias_labels[genderId],
                text: meta.bias_labels[genderId],
                sort: true
            }
            let objPercent = {
                dataField: meta.bias_labels[genderId] + "Percent",
                text: meta.bias_labels[genderId] + " Percent",
                sort: true,
                formatter: percentFormatter
            }
            obj.hidden = true
            objPercent.hidden = true
            obj.label = meta.bias_labels[genderId]
            columnFilters.push(obj)
            columnFilters.push(objPercent)
        }
    }
  }

  // refetch useeffect
  useEffect(() => {
    setIsLoading(true);
    API.get(
      {
        bias: "gender",
        metric: "gap",
        snapshot: "latest",
        population: population,
        property_obj: { date_of_birth: "all", label_lang: "en" },
      },
      processData
    );
  }, [snapshot, population]);

  // refilter useeffect
  useEffect(() => {
    if (allMeta && allMetrics) {
      filterAndCreateVizAndTable(allMeta, allMetrics);
    }
  }, [yearStart, yearEnd]);

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
    <Container className="view-container">
        <h1>Gender Gap By Year of Birth</h1>
        <PopulationToggle handleToggle={handleHumanChange} />
        <h5>
          This plot shows the Date of Birth (DoB) of each biography and
          other content associated with humans in Wikimedia Projects, by gender
        </h5>
        
      <Row className="justify-content-md-center">
        <Col lg={8}>
          <p>All time, as of Aug'20 </p>
          {lineData.length === 0 ? null : (
            <LineChart
              lineData={lineData}
              graphGenders={graphGenders}
              extrema={tableMetaData}
              genderMap={genderMap}
            />
          )}
        </Col>
        <Col sm={4}>
          {snapshotsDropdownOptions}
          <InputGroup className="mb-3" size="sm">
            <InputGroup.Prepend>
              <InputGroup.Text>Year Range:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="text"
              placeholder={yearStart}
              onChange={handleYearStart}
            />
            <FormControl
              type="text"
              placeholder={yearEnd}
              onChange={handleYearEnd}
            />
          </InputGroup>
        </Col>
      </Row>
      <hr />
      <Row className="table-container">
        {isLoading ? loadingDiv : null}
        {isErrored ? errorDiv : null}
        <GenderTable 
          tableArr={tableArr} 
          tableColumns={tableColumns} 
        /> 
      </Row>
    </Container>
  );
}

export default GenderByDOBView;
