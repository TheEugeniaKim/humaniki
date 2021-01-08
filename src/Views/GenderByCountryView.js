import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import WorldMap from '../Components/WorldMap'
import WorldMapPropertySelection from '../Components/WorldMapPropertySelection'
import data from '../Components/custom.geo.json'
import { Col, Row, InputGroup, FormControl, Container } from 'react-bootstrap'
import { propTypes } from 'react-bootstrap/esm/Image';
import { filterMetrics, populations } from '../utils.js'

import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator'
import PopulationToggle from "../Components/PopulationToggler";
import {ValueContainer} from "../Components/LimitedMultiSelect";


function GenderByCountryView({API}){
  let makeCountryFilterFn = (selectedCountries) => (metric) => {
    const selectedCountriesValues = selectedCountries.map(country => country.value)
    console.log("selected Countries:", selectedCountries, "metrics:", metric, "filter", selectedCountriesValues.includes(metric.item.citizenship))
    
    return selectedCountriesValues.includes(metric.item.citizenship)
  }
  const [allMetrics, setAllMetrics] = useState(null)
  const [allMeta, setAllMeta] = useState(null)
  const [allCountries, setAllCountries] = useState([])
  const [population, setPopulation] = useState(populations.GTE_ONE_SITELINK)
  const [mapData, setMapData] = useState(null)
  const [tableColumns, setTableColumns] = useState([])
  const [tableArr, setTableArr] = useState([])
  const [snapshot, setSnapshot] = useState("latest")
  const [tableMetaData, setTableMetaData] = useState({})
  const [property, setProperty] = useState("female")
  const [genders, setGenders] = useState([])
  const [selectedCountries, setSelectedCountries] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isErrored, setIsErrored] = useState(false)

  function handleSnapshot(e){
    console.log(e.target.value)
    setSnapshot(e.target.value)
  }

  function handleHumanChange(event){
    setIsLoading(true) 
    setPopulation(event)
  }

  function percentFormatter(cell, row){
    if (!cell){
      return
    }
    return cell.toFixed(3)
  }

  function createMultiSelectData(metrics){
    const multiSelectData = []
    metrics.forEach(country => {
      if (country.item_label.citizenship){
        return multiSelectData.push({
          label: country.item_label.citizenship,
          value: country.item.citizenship
        })
      }
    })
    return multiSelectData
  }

  function processColumnsData(meta, metrics){
    let columns = []
    columns.push({dataField: "country", text: "Country", filter: textFilter()})
    columns.push({dataField: "total",text: "Total",sort: true})
    for (let genderId in meta.bias_labels) {
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
      obj.label = meta.bias_labels[genderId]
      columns.push(obj)
      columns.push(objPercent)
    }
    setTableColumns(columns)
  }

  function processMapAndTableData(meta, metrics){
    let tableArr = []
    let genders = Object.values(meta.bias_labels).map(gender => {
      return {
        value: gender, 
        label: gender
      }
    })
    let preMapData = data
    const extrema = {
      totalMax: Number.NEGATIVE_INFINITY,
      totalMin: Number.POSITIVE_INFINITY
    }

    metrics.forEach((obj, index) => {
      // Handle Formatting Table Data 
      let tableObj = {}
      tableObj.key = index 
      tableObj.country = obj.item_label.citizenship 
      tableObj.total = Object.values(obj.values).reduce((a,b) => a + b)
      for (let genderId in meta.bias_labels) {
        let label = meta.bias_labels[genderId] ? meta.bias_labels[genderId] : genderId
        tableObj[label] = obj["values"][genderId] ? obj["values"][genderId] : 0 
        tableObj[label + "Percent"] = obj["values"][genderId] ? (obj["values"][genderId]/tableObj["total"])*100 : 0
      }
      if (tableObj.country){
        tableArr.push(tableObj)
      }
      
      //Handle Formatting countryData for WorlMap
      preMapData.features.map(country => {
        // console.log("country", country)
        if (country["properties"]["iso_a2"] === obj["item_label"]["iso_3166"]){
          // console.log("editing:", country)
          let indexPosition = preMapData.features.findIndex(element => element["properties"]["iso_a2"] === obj["item_label"]["iso_3166"])
          preMapData.features[indexPosition]["properties"]["total"] = Object.values(obj["values"]).reduce((a,b) => a + b)
          preMapData.features[indexPosition]["properties"]["genders"] = Object.values(meta.bias_labels)
          preMapData.features[indexPosition]["properties"]["text"] = preMapData.features[indexPosition]["properties"]["name"]
          for (let genderId in meta.bias_labels) {
            let label = meta.bias_labels[genderId]
            country["properties"][label] = obj["values"][genderId] ? obj["values"][genderId] : 0 
            country["properties"][label + "Percent"] = obj["values"][genderId] ? (obj["values"][genderId]/country["properties"]["total"])*100 : 0
          }
          for (let genderId in meta.bias_labels) {
            let label = meta.bias_labels[genderId]
            country["properties"]["text"] = country["properties"]["text"] + `
              ${label}: ${country["properties"][label] ? country["properties"][label] : 0} (${country["properties"][label + "Percent"].toFixed(3)})%
            ` 
          }
        }
      })
    })

    setMapData(preMapData)
    setTableArr(tableArr)
    setTableMetaData(extrema)
    setGenders(genders)
  }

  function filterAndCreateVizAndTable(meta, metrics){
    const countryFilterFn = selectedCountries ? makeCountryFilterFn(selectedCountries) : (metric) => true
    const filteredMetrics = filterMetrics(metrics, countryFilterFn)
    
    processColumnsData(meta, filteredMetrics)
    processMapAndTableData(meta, filteredMetrics)
  }

  function processAPIData(err, fetchData){
    if (err){
      setIsErrored(true)
    } else {
      setAllMetrics(fetchData.metrics)
      setAllMeta(fetchData.meta)
      let multiSelectData = createMultiSelectData(fetchData.metrics)
      setAllCountries(multiSelectData)
      filterAndCreateVizAndTable(fetchData.meta, fetchData.metrics)
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
      population: population, 
      property_obj: {citizenship: "all", label_lang: "en"}
    }, processAPIData)
  },[population, snapshot])

// ReFilter useEffect: 
  useEffect(() => {
    if (allMeta, allMetrics){
      filterAndCreateVizAndTable(allMeta, allMetrics)
    }
  }, [selectedCountries])

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }

  const errorDiv = <div>Error</div>
  const loadingDiv = <div>Loading</div>

  return (
    <Container className="view-container">
      <Row className="justify-content-md-center">
        <h1>Gender Gap By Country</h1>
        <h5>
          This will be the description of the plot data that's represented below. 
          Something like: This plot displays
        </h5>
        
        <p style={{border: "2px solid"}}>
          Note: As for January, 2016, only about 30% of biographies had place
          of birth, so this data is incomplete.
        </p>
      </Row>

      <Row className="input-area">
        <h6>Different Wikipedia Categories of Humans</h6>
        <PopulationToggle handleToggle={handleHumanChange}/>

        <InputGroup className="mb-3" size="sm" controlid="years">
          <InputGroup.Prepend>
            <InputGroup.Text>Snapshot:</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl type="text" placeholder={snapshot} onChange={handleSnapshot} />
        </InputGroup>
        <br/>
      </Row>

      <Row className="justify-content-md-center">
        <Col>
          <WorldMap 
            mapData={mapData}
            property={property}
            extrema={tableMetaData}
            genders={genders}
          />
        </Col>
        <Col>
          <Select 
            options={genders}
            onChange={e => setProperty(e.value)}
          />
          <Select 
            options={allCountries}
            isMulti
            isClearable={true}
            onChange={setSelectedCountries}
          />
        </Col>
      </Row>
      

      <div className="table-container">
        {isLoading? loadingDiv:null }
        {isErrored? errorDiv: null }
        { 
          tableColumns.length === 0 ? null :
          <BootstrapTable 
            keyField='country' 
            data={ tableArr } 
            columns={ tableColumns } 
            filter={ filterFactory({ afterFilter }) } 
            pagination={ paginationFactory(10) }
            className='table'
          />
        }
      </div>
     
    </Container> 

  )
}

export default GenderByCountryView 
