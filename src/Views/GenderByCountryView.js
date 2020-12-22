import React, { useState, useEffect } from 'react'
import WorldMap from '../Components/WorldMap'
import WorldMapPropertySelection from '../Components/WorldMapPropertySelection'
import data from '../Components/custom.geo.json'
import { ToggleButtonGroup, ToggleButton, Form, InputGroup, FormControl, Container } from 'react-bootstrap'
import { propTypes } from 'react-bootstrap/esm/Image';
import populations from '../utils.js'

import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator'


function GenderByCountryView({getAPI}){
  const [selectBirthVsCitizenship, setBirthVsCitizenship] = useState("country-of-birth")
  const [selectedWikipediaHumanType, setSelectedWikipediaHumanType] = useState(populations.ALL_WIKIDATA)
  const [mapData, setMapData] = useState(null)
  const [tableColumns, setTableColumns] = useState([])
  const [tableArr, setTableArr] = useState([])
  const [snapshot, setSnapshot] = useState("latest")
  const [tableMetaData, setTableMetaData] = useState({})
  const [property, setProperty] = useState("female")
  const [genders, setGenders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isErrored, setIsErrored] = useState(false)

  function handleSnapshot(e){
    console.log(e.target.value)
    setSnapshot(e.target.value)
  }

  function handleChange(event){
    if (event === "birth") {
      setBirthVsCitizenship("country-of-birth")
    } else if (event === "citizenship") {
      setBirthVsCitizenship("country-of-citizenship")
    }
  }

  function handleHumanChange(event){
    if (event === "all") {
      setIsLoading(true)
      setSelectedWikipediaHumanType(populations.ALL_WIKIDATA)
    } else if (event === "at-least-one") {
      setIsLoading(true)
      setSelectedWikipediaHumanType(populations.GTE_ONE_SITELINK)
    } 
  }

  function percentFormatter(cell, row){
    if (!cell){
      return
    }
    return cell.toFixed(3)
  }

  function processAPIData(err, fetchData){
    if (err){
      setIsErrored(true)
    } else {
    
      let tableArr = []
      let columns = []
      let genders = Object.values(fetchData.meta.bias_labels)
      let preMapData = data
      const extrema = {
        totalMax: Number.NEGATIVE_INFINITY,
        totalMin: Number.POSITIVE_INFINITY
      }

      function percentFormatter(cell,row){
        if (!cell){
          return
        }
        return cell.toFixed(3)
      }
      columns.push({dataField: "country", text: "Country", filter: textFilter()})
      columns.push({dataField: "total",text: "Total",sort: true})
      for (let genderId in fetchData.meta.bias_labels) {
        let obj = {
          dataField: fetchData.meta.bias_labels[genderId],
          text: fetchData.meta.bias_labels[genderId],
          sort: true
        }
        let objPercent = {
          dataField: fetchData.meta.bias_labels[genderId] + "Percent",
          text: fetchData.meta.bias_labels[genderId] + " Percent",
          sort: true,
          formatter: percentFormatter
        }
        obj.label = fetchData.meta.bias_labels[genderId]
        columns.push(obj)
        columns.push(objPercent)
      }

      fetchData.metrics.forEach((obj, index) => {
        // Handle Formatting Table Data 
        let tableObj = {}
        tableObj.key = index 
        tableObj.country = obj.item_label.citizenship 
        tableObj.total = Object.values(obj.values).reduce((a,b) => a + b)
        for (let genderId in fetchData.meta.bias_labels) {
          let label = fetchData.meta.bias_labels[genderId] ? fetchData.meta.bias_labels[genderId] : genderId
          tableObj[label] = obj["values"][genderId] ? obj["values"][genderId] : 0 
          tableObj[label + "Percent"] = obj["values"][genderId] ? (obj["values"][genderId]/tableObj["total"])*100 : 0
        }
        if (tableObj.country){
          tableArr.push(tableObj)
        }
        
        //Handle Formatting countryData for WorlMap
        preMapData.features.map(country => {
          if (country["properties"]["iso_a2"] === obj["item_label"]["iso_3166"]){
            console.log("editing:", country)
            let indexPosition = preMapData.features.findIndex(element => element["properties"]["iso_a2"] === obj["item_label"]["iso_3166"])
            preMapData.features[indexPosition]["properties"]["total"] = Object.values(obj["values"]).reduce((a,b) => a + b)
            preMapData.features[indexPosition]["properties"]["genders"] = Object.values(fetchData.meta.bias_labels)
            preMapData.features[indexPosition]["properties"]["text"] = preMapData.features[indexPosition]["properties"]["name"]
            for (let genderId in fetchData.meta.bias_labels) {
              let label = fetchData.meta.bias_labels[genderId]
              country["properties"][label] = obj["values"][genderId] ? obj["values"][genderId] : 0 
              country["properties"][label + "Percent"] = obj["values"][genderId] ? (obj["values"][genderId]/country["properties"]["total"])*100 : 0
            }
            for (let genderId in fetchData.meta.bias_labels) {
              let label = fetchData.meta.bias_labels[genderId]
              country["properties"]["text"] = country["properties"]["text"] + `
                ${label}: ${country["properties"][label] ? country["properties"][label] : 0} (${country["properties"][label + "Percent"].toFixed(3)})%
              ` 
            }
          }
        })
        console.log(preMapData)
        

      })
      setMapData(preMapData)
      setTableArr(tableArr)
      setTableColumns(columns)
      setTableMetaData(extrema)
      setGenders(genders)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getAPI({
      bias: "gender", 
      metric: "gap", 
      snapshot: snapshot, 
      population: selectedWikipediaHumanType, 
      property_obj: {citizenship: "all", label_lang: "en"}
    }, processAPIData)
  },[selectedWikipediaHumanType, selectBirthVsCitizenship, snapshot])

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }

  const errorDiv = <div>Error</div>
  const loadingDiv = <div>Loading</div>
  return (
    <Container className="view-container">
      <h1>Gender Gap By Country</h1>
      <h5>This will be the description of the plot data that's represented below</h5>
      
      <div className="input-area">
        <div>
          <p style={{border: "2px solid"}}>
            Note: As for January, 2016, only about 30% of biographies had place
            of birth, so this data is incomplete.
          </p>
        </div>

        <h6>Data Selection</h6>
          {selectBirthVsCitizenship}

          <ToggleButtonGroup type="radio" name="data-selection" defaultValue={"birth"} onChange={handleChange}> 
            <Form.Check
              type="radio"
              label="Country of Birth"
              name="birth"
              value="birth"
            />
            <Form.Check
              type="radio"
              label="Country of Citizenship"
              name="citizenship"
              value="citizenship"
            />
          </ToggleButtonGroup>
          <InputGroup className="mb-3" size="sm" controlid="years">
            <InputGroup.Prepend>
              <InputGroup.Text>Snapshot:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl type="text" placeholder={snapshot} onChange={handleSnapshot} />
          </InputGroup>
          <br/>

          <div className="human-div">
            <h6>Different Wikipedia Categories of Humans</h6>
            <ToggleButtonGroup type="radio" name="human-type" defaultValue={"all"} onChange={handleHumanChange}>
              <ToggleButton value={"all"} name="all" size="lg" variant="outline-dark"> 
                All Humans on Wikidata
              </ToggleButton>
              <ToggleButton value={"at-least-one"} name="at-least-one" size="lg" variant="outline-dark">
                Humans With At Least One Wikipedia Article
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
      </div>      

      <WorldMap 
        mapData={mapData}
        property={property}
        extrema={tableMetaData}
        genders={genders}
      />
      <select
        value={property}
        onChange={event => setProperty(event.target.value)}
      >
        <WorldMapPropertySelection 
          options={genders}
        />
      </select>
      

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
