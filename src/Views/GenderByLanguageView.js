import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form} from 'react-bootstrap'
import Select from 'react-select'

import GenderTable from '../Components/GenderTable'
import ScatterPlot from '../Components/ScatterPlot'
import { createColumns, filterMetrics, formatDate } from '../utils'

import PopulationToggle from "../Components/PopulationToggler";
import {ValueContainer} from "../Components/LimitedMultiSelect";

function GenderByLanguageView({API, snapshots}){
  let makeProjectFilterFn = (selectedProjects) => (metric) => {
    // higher order function to predicate each indiv. metric
    const selectedProjectsValues = selectedProjects.map(project => project.value)
    return selectedProjectsValues.includes(metric.item.project)
  }
  const [allMetrics, setAllMetrics] = useState(null)
  const [allMeta, setAllMeta] = useState(null)
  const [allProjects, setAllProjects] = useState([])
  const [selectedProjects, setSelectedProjects] = useState(null)
  const [tableArr, setTableArr] = useState([])
  const [tableMetaData, setTableMetaData] = useState({})
  const [tableColumns, setTableColumns] = useState([])
  const [snapshot, setSnapshot] = useState("latest")
  const [isLoading, setIsLoading] = useState(true)
  const [isErrored, setIsErrored] = useState(false)

  function handleSnapshotChange(e) {
    setSnapshot(e.target.value)
  }

  function createChartData(meta, metrics){
    const tableArr = []
    const extrema = {
      percentMax: Number.NEGATIVE_INFINITY,
      percentMin: Number.POSITIVE_INFINITY,
      totalMax: Number.NEGATIVE_INFINITY,
      totalMin: Number.POSITIVE_INFINITY
    }
    metrics.forEach((obj, index) => {
      let tableObj = {}
      tableObj.key = index
      tableObj.language = obj.item_label.project
      tableObj.total = Object.values(obj.values).reduce((a, b) => a + b)
      tableObj.sumOtherGenders = 0
      for (let genderId in meta.bias_labels) {
        let label = meta.bias_labels[genderId]
        tableObj[label] = obj["values"][genderId] ? obj["values"][genderId] : 0
        tableObj[label + "Percent"] = obj["values"][genderId] ? (obj["values"][genderId]/tableObj["total"])*100 : 0
        if (genderId !=="6581097" && genderId !=="6581072"){
          tableObj.sumOtherGenders += obj["values"][genderId] ? obj["values"][genderId] : 0
        }
      }
      tableObj.sumOtherGendersPercent = (tableObj.sumOtherGenders/tableObj.total)*100
      tableArr.push(tableObj)

      let nonMalePercent = 100 - tableObj.malePercent
      if (nonMalePercent > extrema.percentMax) {
        extrema.percentMax = nonMalePercent
      } else if (nonMalePercent < extrema.percentMin) {
        extrema.percentMin = nonMalePercent
      }

      if (tableObj.total > extrema.totalMax) {
        extrema.totalMax = tableObj.total
      } else if (tableObj.total < extrema.totalMin) {
        extrema.totalMin = tableObj.total
      }
    })

    setTableMetaData(extrema)
    setTableArr(tableArr)
  }

  function filterAndCreateVizAndTable(meta, metrics){
    console.log("IN FILTER AND CREATE VIZ", allProjects)
    // const projectFilterFn = makeProjectFilterFn()

    const projectFilterFn = selectedProjects ? makeProjectFilterFn(selectedProjects) : (metric) => true
    const filteredMetrics = filterMetrics(metrics, projectFilterFn)
    setTableColumns(createColumns(meta, filteredMetrics, "language"))
    createChartData(meta, filteredMetrics)
  }

  function createMultiselectData(metrics){
    const multiSelectData = metrics.map(metric => {
      return {
        label: metric.item_label.project,
        value: metric.item.project,
      }
    })
    return multiSelectData
  }

  function processData(err, data){
    if (err) {
      console.log("error is", err)
      setIsErrored(true)
    } else {
      setAllMetrics(data.metrics)
      setAllMeta(data.meta)
      let multiSelectData = createMultiselectData(data.metrics)
      console.log("multiSelectData", multiSelectData)
      setAllProjects(multiSelectData)
      filterAndCreateVizAndTable(data.meta,data.metrics)
    }
    setIsLoading(false)
    return true
  }
// ReFetch useEffect:
  useEffect(() => {
    API.get({
      bias: "gender",
      metric: "gap",
      snapshot: "latest",
      population: "gte_one_sitelink",
      property_obj: {project: "all", label_lang: "en"}
    }, processData)
  }, [snapshots])

// ReFilter useEffect: 
  useEffect(() => {
    if (allMeta && allMetrics){
      console.log("IN reFilterUseEffect!! SUCCESS")
      filterAndCreateVizAndTable(allMeta, allMetrics)
    }
  }, [selectedProjects])

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }

  const errorDiv = <div>Error</div>
  const loadingDiv = <div>Loading</div>
  const snapshotsDropdownOptions = snapshots ? (
    <div>
        <Form.Label>Snapshot (YYYY-DD-MM)</Form.Label>
        <Form.Control
            as="select"
            onChange={handleSnapshotChange}
            value={snapshot ? snapshot :  "latest"}
            >
            {
                snapshots.map((snapshot, index) => (
                    <option key={snapshot.id}>{index === 0 ?  formatDate(snapshot.date)+" (latest)" : formatDate(snapshot.date) }</option>
                ))
            }
        </Form.Control>
    </div>
  ) : <div> snapshots loading </div>

  return (
    <Container >
      <Row className="justify-content-md-center">
        <h1>Gender Gap By Wikipedia Language Editions</h1>
        <h5>
          This plot shows the Language each biography is written in Wikidata,
          by gender, non-binary gender, by last count there are 9 non-binary genders,
          are displayed in the tables, and accounted for in the full data set
        </h5>

        <p style={{border: "2px solid"}}>
          Note: As for January, 2016, only about 72% and 36% of biographies had date
          of birth and date of death, respectively, so this data is incomplete.
        </p>
      </Row>

      <Row className="input-area">
        <h6>Different Wikipedia Categories of Humans</h6>
          <PopulationToggle GTE_ONLY={true} />
          { snapshotsDropdownOptions }
      </Row>
      <Row className="justify-content-md-center">
        <Col lg={10}>
          <ScatterPlot 
            data={tableArr}
            extrema={tableMetaData}
            columns={tableColumns}
          />
        </Col>
        <Col sm={2}>
          <Select
            axis="xy"
            className="basic-single"
            // maxMenuHeight={190}
            options={allProjects}
            isClearable={true}
            isMulti
            components={{
              ValueContainer
            }}
            name="filterProjects"
            onChange={setSelectedProjects}
          />
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        <div className="table-container">
          {isLoading ? loadingDiv : null }
          {isErrored ? errorDiv : null }
          <GenderTable 
            tableArr={tableArr} 
            tableColumns={tableColumns} 
        /> 
        </div>
        <br/>
        <br/>
      </Row>
    </Container>
  )
}

export default GenderByLanguageView