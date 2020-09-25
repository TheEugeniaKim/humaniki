import React, { useState, useEffect } from 'react'
import WorldMap from '../Components/WorldMap'
import data from '../Components/WorldData.geo.json'
import { ToggleButtonGroup, ToggleButton, Form } from 'react-bootstrap'
import RadialBarChart from '../Components/RadialBarChartButton'
import { propTypes } from 'react-bootstrap/esm/Image';

import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';


function GenderByCountryView(props){
  const [selectBirthVsCitizenship, setBirthVsCitizenship] = useState("country-of-birth")
  const [selectedWikipediaHumanType, setSelectedWikipediaHumanType] = useState("all")
  
  function handleChange(event){
    if (event === "birth") {
      setBirthVsCitizenship("country-of-birth")
    } else if (event === "citizenship") {
      setBirthVsCitizenship("country-of-citizenship")
    }
  }

  function handleHumanChange(event){
    console.log("Handle Human Change", event)
    if (event === "all") {
      setSelectedWikipediaHumanType("all")
    } else if (event === "at-least-one") {
      setSelectedWikipediaHumanType("at-least-one")
    } else if (event === "more-than-one") {
      setSelectedWikipediaHumanType("more-than-one")
    }
  }

  const [apiData, setAPIData] = useState([])
  function fetchData() {
    // fetch(`http://localhost:3000/v1/${selectedWikipediaHumanType}/gender/aggregated/2020-09-15/geography/${selectBirthVsCitizenship}`)
    fetch("http://localhost:3000/v1")
      .then(response => response.json())
      .then(data => {
        setAPIData(data)
      })
      // .then(processAPIData())
  }

  const tableData = [{
    id: 1, 
    country:"United States", 
    total: 84345324,
    totalWithGender: 24234352,
    women: 243503,
    WomenPercent: 23423,
    men: 30429424,
    MenPercent: 72,
    nonBinary: 32,
    nonBinaryPercent: 0
  }, {
    id: 2, 
    country: "Canada",
    total: 84345324,
    totalWithGender: 24234352,
    women: 243503,
    WomenPercent: 28,
    men: 30429424,
    MenPercent: 72,
    nonBinary: 32,
    nonBinaryPercent: 0
  }, {
    id: 3, 
    country: "Mexico",
    total: 84345324,
    totalWithGender: 24234352,
    women: 243503,
    WomenPercent: 28,
    men: 30429424,
    MenPercent: 72,
    nonBinary: 32,
    nonBinaryPercent: 0
  }]
  const columns = [{
    dataField: "country",
    text: "Country",
    filter: textFilter()

  }, {
    dataField: "total",
    text: "Total",
    sort: true
    
  }, {
    dataField: "totalWithGender",
    text: "Total With Gender",
    sort: true
  }, {
    dataField: "women",
    text: "Women",
    sort: true
  }, {
    dataField: "WomenPercent",
    text: "Women (%)",
    sort: true
  }, {
    dataField: "men",
    text: "Men",
    sort: true
  }, {
    dataField: "MenPercent",
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
 
  function processAPIData(){
    console.log(apiData)
    // return apiData.all-wikidata.gender.aggregated
  }

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }
  return (
    <div>
    {console.log(processAPIData())}
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
          
          <div >
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

      <WorldMap data={data} />

      <div className="table-container">
        <BootstrapTable 
          keyField='id' 
          data={ tableData } 
          columns={ columns } 
          filter={ filterFactory({ afterFilter }) } 
        />
      </div>
     
    </div> 

  )
}

export default GenderByCountryView 
