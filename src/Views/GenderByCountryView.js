import React, { useState, useEffect } from 'react'
import WorldMap from '../Components/WorldMap'
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
  const [apiData, setAPIData] = useState([])
  const [mapData, setMapData] = useState(null)
  const [tableArr, setTableArr] = useState([])
  const [snapshot, setSnapshot] = useState("latest")

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
    } else if (event === "more-than-one") {
      setSelectedWikipediaHumanType("more-than-one")
    }
  }

  function percentFormatter(cell, row){
    return cell.toFixed(3)
  }

  function fetchData() {
    // fetch(`http://localhost:3000/v1/${selectedWikipediaHumanType}/gender/aggregated/2020-09-15/geography/${selectBirthVsCitizenship}.json`)
    // fetch('http://localhost:3000/v1/all-wikidata/gender/aggregated/2020-09-15/geography/citizenship.json')
    let baseURL = process.env.REACT_APP_API_URL
    let url = baseURL + `v1/gender/gap/${snapshot}/gte_one_sitelink/properties?citizenship=all`
    fetch(url)
      .then(response => response.json())
      .then(fetchData => {
        setAPIData(fetchData)
        processAPIData(fetchData)
      })
  }

  function processAPIData(fetchData){
    let arr = []
    const countryData = []
    data.features.forEach(country => {
      fetchData.metrics.forEach((fetchObj, index) => {
        if (country["properties"]["iso_a2"] === fetchObj["item_label"]["iso_3166"]) {          
          country.properties.total = Object.values(fetchObj.values).reduce((a, b) => a + b)
          country.properties.women = fetchObj.values["6581072"] ? fetchObj.values["6581072"] : 0
          country.properties.men = fetchObj.values["6581097"] ? fetchObj.values["6581097"] : 0
          country.properties.womenPercent = (country.properties.women/country.properties.total)*100
          country.properties.menPercent = (country.properties.men/country.properties.total)*100
          countryData.push(country)

          arr.push({
            country: country.properties.name,
            total: country.properties.total,
            women: country.properties.women,
            men: country.properties.men,
            womenPercent: country.properties.womenPercent,
            menPercent: country.properties.menPercent
          })
        }
      })
    })
    setMapData(data)
    setTableArr(arr)
  }
  const columns = [{
    dataField: "country",
    text: "Country",
    filter: textFilter()

  }, {
    dataField: "total",
    text: "Total",
    sort: true
    
  }, {
    dataField: "women",
    text: "Women",
    sort: true
  }, {
    dataField: "womenPercent",
    text: "Women (%)",
    sort: true,
    formatter: percentFormatter
  }, {
    dataField: "men",
    text: "Men",
    sort: true
  }, {
    dataField: "menPercent",
    text: "Men (%)",
    sort: true,
    formatter: percentFormatter
  }]

  useEffect(() => {
    fetchData()
  },[selectedWikipediaHumanType, selectBirthVsCitizenship, snapshot])

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }
  const [property, setProperty] = useState("women")
  return (
    <Container>
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
          <InputGroup className="mb-3" size="sm" controlId="years">
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
                Humans With Atleast One Wikipedia Article
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

        
      </div>      

      <WorldMap 
        mapData={mapData}
        property={property}
      />
      <select
        value={property}
        onChange={event => setProperty(event.target.value)}
      >
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="non-binary">Non-binary</option>
        <option value="menPercent">Percent Men</option>
        <option value="womenPercent">Percent Women</option>
        <option value="percent-non-binary">Percent Non-Binary</option>
      </select>


      <div className="table-container">
        <BootstrapTable 
          keyField='country' 
          data={ tableArr } 
          columns={ columns } 
          filter={ filterFactory({ afterFilter }) } 
          pagination={ paginationFactory(10) }
        />
      </div>
     
    </Container> 

  )
}

export default GenderByCountryView 
