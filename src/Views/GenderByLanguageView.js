import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form} from 'react-bootstrap'
import Select from 'react-select'

import GenderTable from '../Components/GenderTable'
import ScatterPlot from '../Components/ScatterPlot'
import { createColumns, filterMetrics, formatDate, errorDiv, loadingDiv, QIDs, keyFields } from '../utils'

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
  const [tableColumns, setTableColumns] = useState([{}])
  const [snapshot, setSnapshot] = useState("latest")
  const [isLoading, setIsLoading] = useState(true)
  const [isErrored, setIsErrored] = useState(false)

  function handleSnapshotChange(e) {
    let date = e.target.value
    if (date.slice(11,20) === "(latest)"){
      date = date.slice(0, 10)
    }
    setSnapshot(date.replace(/-+/g, ''))
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
      tableObj.project = obj.item.project
      tableObj.language = obj.item_label.project
      tableObj.total = Object.values(obj.values).reduce((a, b) => a + b)
      tableObj.sumOtherGenders = 0
      for (let genderId in meta.bias_labels) {
        let label = meta.bias_labels[genderId]
        tableObj[label] = obj["values"][genderId] ? obj["values"][genderId] : 0
        tableObj[label + "Percent"] = obj["values"][genderId] ? (obj["values"][genderId]/tableObj["total"])*100 : 0
        if (genderId !==QIDs.male && genderId !==QIDs.female){
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
      return setIsErrored(true)
    } else {
      setAllMetrics(data.metrics)
      setAllMeta(data.meta)
      let multiSelectData = createMultiselectData(data.metrics)
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
      snapshot: snapshot,
      population: "gte_one_sitelink",
      property_obj: {project: "all", label_lang: "en"}
    }, processData)
  }, [snapshots, snapshot])

// ReFilter useEffect: 
  useEffect(() => {
    if (allMeta && allMetrics){
      filterAndCreateVizAndTable(allMeta, allMetrics)
    }
  }, [selectedProjects])

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
            value={formatDate(snapshot)}
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
    <div className="view-container">
        <h1>Gender Gap By Language Editions in Wikimedia Projects</h1>
        <PopulationToggle GTE_ONLY={true} />
        <h5>
          Comparative view of gendered content in different Wikimedia Projects
        </h5>

        <p>
          This plot compares number of gendered content in different wikimedia projects
          to women/men/other genders percentage of that content. Comparisons of language
          editions and wikimedia project of your interest can be made using filters 
        </p>

      <Row className="justify-content-md-center">
        <Col lg={8}>
          <ScatterPlot 
            data={tableArr}
            extrema={tableMetaData}
            columns={tableColumns}
          />
        </Col>
        <Col sm={4}>
          { snapshotsDropdownOptions }
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
            keyField={keyFields.language}
          /> 
        </div>
        <br/>
        <br/>
      </Row>
    </div>
  )
}

export default GenderByLanguageView