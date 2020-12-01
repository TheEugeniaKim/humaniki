import React, { useState, useEffect } from 'react'
import WorldMap from '../Components/WorldMap'
import WorldMapPropertySelection from '../Components/WorldMapPropertySelection'
import data from '../Components/custom.geo.json'
import { ToggleButtonGroup, ToggleButton, Form, InputGroup, FormControl, Container } from 'react-bootstrap'
import RadialBarChart from '../Components/RadialBarChartButton'
import { propTypes } from 'react-bootstrap/esm/Image';

import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator'


function GenderByCountryView(props){
  const [selectBirthVsCitizenship, setBirthVsCitizenship] = useState("country-of-birth")
  const [selectedWikipediaHumanType, setSelectedWikipediaHumanType] = useState("all")
  const [mapData, setMapData] = useState(null)
  const [tableColumns, setTableColumns] = useState([])
  const [tableArr, setTableArr] = useState([])
  const [snapshot, setSnapshot] = useState("latest")
  const [tableMetaData, setTableMetaData] = useState({})
  const [property, setProperty] = useState("female")
  const [genders, setGenders] = useState([])

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
      setSelectedWikipediaHumanType("all-wikidata")
    } else if (event === "at-least-one") {
      setSelectedWikipediaHumanType("at-least-one")
    } 
  }

  function percentFormatter(cell, row){
    if (!cell){
      return
    }
    return cell.toFixed(3)
  }

  function fetchData() {
    // fetch(`http://localhost:3000/v1/${selectedWikipediaHumanType}/gender/aggregated/2020-09-15/geography/${selectBirthVsCitizenship}.json`)
    // fetch('http://localhost:3000/v1/all-wikidata/gender/aggregated/2020-09-15/geography/citizenship.json')
    let baseURL = process.env.REACT_APP_API_URL
    let url = baseURL + `v1/gender/gap/${snapshot}/gte_one_sitelink/properties?citizenship=all&label_lang=en`
    fetch(url)
      .then(response => response.json())
      .then(fetchData => {
        processAPIData(fetchData)
      })
  }

  function processAPIData(fetchData){
    let tableArr = []
    let columns = []
    let genders = Object.values(fetchData.meta.bias_labels)
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
        let label = fetchData.meta.bias_labels[genderId]
        tableObj[label] = obj["values"][genderId] ? obj["values"][genderId] : 0 
        tableObj[label + "Percent"] = obj["values"][genderId] ? (obj["values"][genderId]/tableObj["total"])*100 : 0
      }
      if (tableObj.country){
        tableArr.push(tableObj)
      }
      
      //Handle Formatting countryData for WorlMap
      data.features.map(country => {
        if (country["properties"]["iso_a2"] === obj["item_label"]["iso_3166"]){
          let indexPosition = data.features.findIndex(element => element["properties"]["iso_a2"] === obj["item_label"]["iso_3166"])
          data.features[indexPosition]["properties"]["total"] = Object.values(obj["values"]).reduce((a,b) => a + b)
          for (let genderId in fetchData.meta.bias_labels) {
            let label = fetchData.meta.bias_labels[genderId]
            country["properties"][label] = obj["values"][genderId] ? obj["values"][genderId] : 0 
            country["properties"][label + "Percent"] = obj["values"][genderId] ? (obj["values"][genderId]/country["properties"]["total"])*100 : 0
          }
        }
      })
      
      

    })
    setMapData(data)
    setTableArr(tableArr)
    setTableColumns(columns)
    setTableMetaData(extrema)
    setGenders(genders)
  }

  useEffect(() => {
    fetchData()
  },[selectedWikipediaHumanType, selectBirthVsCitizenship, snapshot])

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }

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
