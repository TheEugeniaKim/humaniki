import React, { useState, useEffect } from 'react'
import WorldMap from '../Components/WorldMap'
import data from '../Components/WorldData.geo.json'
import { ToggleButtonGroup, ToggleButton, Form } from 'react-bootstrap'
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

  function fetchData() {
    // fetch(`http://localhost:3000/v1/${selectedWikipediaHumanType}/gender/aggregated/2020-09-15/geography/${selectBirthVsCitizenship}.json`)
    fetch('http://localhost:3000/v1/all-wikidata/gender/aggregated/2020-09-15/geography/citizenship.json')
    // fetch("http://localhost:3000/v1")
      .then(response => response.json())
      .then(fetchData => {
        fetchData = Object.entries(fetchData).map((e) => ( { [e[0]]: e[1] } ))
        setAPIData(fetchData)
        processAPIData(fetchData)
      })
  }

  let arr = []
  function processAPIData(fetchData){
    data.features.forEach(country => {
      fetchData.forEach((fetchObj, index) => {
        let key = Object.keys(fetchObj)[0]
        if (country.properties.iso_a2 === key) {
          country["properties"]["total"] = fetchObj[key]["men"] + fetchObj[key]["women"] + fetchObj[key]["non-binary"]
          country["properties"]["men"] = fetchObj[key]["men"]
          country["properties"]["women"] = fetchObj[key]["women"]
          country["properties"]["non-binary"] = fetchObj[key]["non-binary"]
          country["properties"]["percent-men"] = (fetchObj[key]["men"]/country["properties"]["total"]*100).toFixed(2)
          country["properties"]["percent-women"] = (fetchObj[key]["women"]/country["properties"]["total"]*100).toFixed(2)
          country["properties"]["percent-non-binary"] = (fetchObj[key]["non-binary"]/country["properties"]["total"]*100).toFixed(2)

          let obj = {
            id: index,
            country: country["properties"]["name_long"],
            total: fetchObj[key]["men"] + fetchObj[key]["women"] + fetchObj[key]["non-binary"],
            women: fetchObj[key]["women"],
            womenPercent: (fetchObj[key]["women"]/country["properties"]["total"]*100).toFixed(2),
            men: fetchObj[key]["men"],
            menPercent: (fetchObj[key]["men"]/country["properties"]["total"]*100).toFixed(2),
            nonBinary: fetchObj[key]["non-binary"],
            nonBinaryPercent: (fetchObj[key]["non-binary"]/country["properties"]["total"]*100).toFixed(2)
          }
          arr.push(obj)
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
    sort: true
  }, {
    dataField: "men",
    text: "Men",
    sort: true
  }, {
    dataField: "menPercent",
    text: "Men (%)",
    sort: true
  }, {
    dataField: "nonBinary",
    text: "Non-binary",
    sort: true
  }, {
    dataField: "nonBinaryPercent",
    text: "Non-Binary (%)",
    sort: true
  }]

  useEffect(() => {
    fetchData()
  },[selectedWikipediaHumanType, selectBirthVsCitizenship])

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }
  const [property, setProperty] = useState("women")

  return (
    <div>
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

          <br/>

          <div className="human-div">
            <h6>Different Wikipedia Categories of Humans</h6>
            <ToggleButtonGroup type="radio" name="human-type" defaultValue={"all"} onChange={handleHumanChange}>
              <ToggleButton value={"all"} name="all" size="lg" variant="outline-dark"> 
                <RadialBarChart 
                  width={70} 
                  height={70} 
                  outerRadius={35} 
                  innerRadius={25}
                  data={[{label:"men", value: 69},{label: "non-binary", value:1},{label: "women", value: 30}]}
                /> 
                All Humans on Wikidata
              </ToggleButton>
              <ToggleButton value={"at-least-one"} name="at-least-one" size="lg" variant="outline-dark">
                <RadialBarChart 
                  width={70} 
                  height={70} 
                  outerRadius={35} 
                  innerRadius={25}
                  data={[{label:"men", value: 69},{label: "non-binary", value:1},{label: "women", value: 30}]}
                /> 
                Humans With Atleast One Wikipedia Article
              </ToggleButton>
              <ToggleButton value={"more-than-one"} name="at-least-one" size="lg" variant="outline-dark">
                <RadialBarChart 
                  width={70} 
                  height={70} 
                  outerRadius={35} 
                  innerRadius={25}
                  data={[{label:"men", value: 69},{label: "non-binary", value:1},{label: "women", value: 30}]}
                /> 
                Humans With More Than One Wikipedia Article
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

        
      </div>      

      <WorldMap 
        style="width: 600px;"
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
        <option value="percent-men">Percent Men</option>
        <option value="percent-women">Percent Women</option>
        <option value="percent-non-binary">Percent Non-Binary</option>
      </select>


      <div className="table-container">
        <BootstrapTable 
          keyField='id' 
          data={ tableArr } 
          columns={ columns } 
          filter={ filterFactory({ afterFilter }) } 
          pagination={ paginationFactory(10) }
        />
      </div>
     
    </div> 

  )
}

export default GenderByCountryView 
