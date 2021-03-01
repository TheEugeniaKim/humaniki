import React, { useState, useEffect } from "react";
import {
  InputGroup,
  FormControl,
  Form,
  Col,
  Row,
} from "react-bootstrap";
import PopulationToggle from "../Components/PopulationToggler";
import HoverTooltip from '../Components/HoverTooltip';
import LineChart from "../Components/LineChart";
import GenderTable from '../Components/GenderTable';
import ErrorDiv from '../Components/ErrorDiv';
import Licensing from '../Components/Licensing';
import {
  filterMetrics,
  createColumns,
  formatDate,
  populations,
  percentFormatter, 
  loadingDiv,
  QIDs,
  keyFields
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
  const [tableColumns, setTableColumns] = useState([{}]);
  const [tableArr, setTableArr] = useState([]);
  const [graphGenders, setGraphGenders] = useState({});
  const [yearStart, setYearStart] = useState(1600);
  const [yearEnd, setYearEnd] = useState(currYear);
  const [snapshot, setSnapshot] = useState("latest");
  const [snapshotDisplay, setSnapshotDisplay] = useState()
  const [population, setPopulation] = useState(populations.GTE_ONE_SITELINK);
  const [isLoading, setIsLoading] = useState(true);
  const [isErrored, setIsErrored] = useState(false);

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }
  
  function handleHumanChange(e) {
    setIsLoading(true);
    setPopulation(e);
  }

  function handleSnapshotChange(e) {
    let date = e.target.value
    if (date.slice(11,20) === "(latest)"){
      date = date.slice(0, 10)
    }
    setSnapshot(date.replace(/-+/g, ''))
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

  // full lineData shows all genders (before)
  // function createLineData(meta, metrics) {
  //   const lineData = [];
  //   let sumOtherGendersLine = {}
  //   sumOtherGendersLine.name = "sumOtherGenders"
  //   sumOtherGendersLine.values = []
  //   //line data loop
  //   for (let genderId in meta.bias_labels) {
  //     let genderLine = {};
  //     genderLine.name = genderId;
  //     genderLine.values = [];
  //     metrics.forEach((dp) => {
  //       if (Object.keys(dp.values).includes(genderId)) {
  //         let tupleObj = {
  //           year: +dp.item_label.date_of_birth,
  //           value: dp["values"][genderId],
  //         };
  //         genderLine.values.push(tupleObj);
  //       }
  //       // if (Object.keys(dp.values))
  //     });
  //     lineData.push(genderLine);
  //   }
  //   console.log("DOB LINE DATA", lineData)
  //   if (lineData.name !== QIDs.female || lineData.name !== QIDs.male){
  //     console.log("hi")
  //   }
  //   setLineData(lineData)
  // }

  function createLineData(meta, metrics){
    const lineData = [{name: "female", values: []}, {name: "male", values: []}, {name: "sumOtherGenders", values: []}]
    metrics.forEach(date => {
      let sumOtherGendersTotal = 0
      Object.keys(date.values).forEach(gender => {
        if (gender === QIDs.female){
          let tupleObj = {
            year: +date.item_label.date_of_birth,
            value: date["values"][QIDs.female]
          }
          lineData[0].values.push(tupleObj)
        } else if (date["values"][QIDs.male]){
          let tupleObj = {
            year: +date.item_label.date_of_birth,
            value: date["values"][QIDs.male]
          }
          lineData[1].values.push(tupleObj)
        } else {
          sumOtherGendersTotal += date["values"][gender]
        }
      })
      let tupleObj = {
        year: +date.item_label.date_of_birth, 
        value: sumOtherGendersTotal
      }
      lineData[2].values.push(tupleObj)
      // if (date["values"][QIDs.female]){
      //   let tupleObj = {
      //     year: +date.item_label.date_of_birth,
      //     value: date["values"][QIDs.female]
      //   }
      //   lineData[0].values.push(tupleObj)
      // } else if (date["values"][QIDs.male]){
      //   let tupleObj = {
      //     year: +date.item_label.date_of_birth,
      //     value: date["values"][QIDs.male]
      //   }
      //   lineData[1].values.push(tupleObj)
      // } 

    })
    return lineData
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
          // check if gender is male or female 
        if (genderId !==QIDs.male && genderId !==QIDs.female) {
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
    console.log("meta, metrics", meta, metrics, yearStart, yearEnd)
    const yearFilterFn = makeYearFilterFn(yearStart, yearEnd);
    // const filteredMetrics = metrics // TODO: actually filter metrics
    // console.log("Length of prefilter input is ,", metrics.length);
    const filteredMetrics = filterMetrics(metrics, yearFilterFn);
    // Here is genderFilter metrics
    // make fn in utils that will filter metrics by gender
    // const genderFilterMetricsApplied =
    // const genderFilterMetrics = genderFilterMetrics()

    let tableArr, extrema;
    [tableArr, extrema] = createTableArr(meta, filteredMetrics);
    setTableArr(tableArr);
    setTableMetaData(extrema);
    setGenderMap(meta.bias_labels);
    setSnapshotDisplay(meta.snapshot)
    setGraphGenders(Object.values(meta.bias_labels));
    setLineData(createLineData(meta, filteredMetrics));
    setTableColumns(createColumns(meta, filteredMetrics, keyFields.dob));
  }

  function processData(err, data) {
    if (err) {
      setIsErrored(err);
    } else {
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
        if (genderId !==QIDs.male && genderId !==QIDs.female){

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
    console.log("REFETCHING", snapshot)
    API.get(
      {
        bias: "gender",
        metric: "gap",
        snapshot: snapshot,
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
    <div className="view-container dob-view sub-container">
      <h4>Gender by Year of Birth Statistics</h4>
      <PopulationToggle handleToggle={handleHumanChange}/>
      <div className="viz-description">
        <h5>Gender Gap By Year of Birth</h5>
        <p>
          This plot shows the Date of Birth (DoB) of content about humans 
          in all Wikimedia projects, typically Wikipedia biography articles, by gender.
        </p>
      </div>
      <Row className="justify-content-md-center">
        <Col lg={7}>  
          <div className="viz-heading">
            <p className="viz-timestamp">
              All time, as of {snapshotDisplay}
            </p>
            <HoverTooltip view={"dob"} />
          </div>

          {lineData.length === 0 ? null : (
            <LineChart
              lineData={lineData}
              graphGenders={graphGenders}
              extrema={tableMetaData}
              genderMap={genderMap}
            />
          )}
        </Col>
        <Col sm={3}>
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
        <Licensing />
      </Row>
      <hr />
      <Row className="table-container">
        {isLoading ? loadingDiv : null}
        {isErrored ? <ErrorDiv errors={isErrored} /> : null}
        <GenderTable 
          tableArr={tableArr} 
          tableColumns={tableColumns} 
          keyField={keyFields.dob}
        />
      </Row>
    </div>
  );
}

export default GenderByDOBView;
