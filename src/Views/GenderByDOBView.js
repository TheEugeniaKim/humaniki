import React from 'react'
import { ToggleButtonGroup, ToggleButton, InputGroup, FormControl, Form, Row, Col, Table } from 'react-bootstrap'
import LineChart from '../Components/LineChart'

import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';


function GenderByDOBView(){
  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
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
  
  function handleChange() {
    console.log("Handle Change")
  }

  function handleHumanChange() {
    console.log("HANDLE HUMAN CHANGE")
  }


  return (
    <div>
      <h1>Gender Gap By Year of Birth and Year of Death Statistics</h1>
      <h5>
        This plot shows the Date of Birth (DoB) and Date of Death (DoD) of each biography in Wikidata, 
        by gender, non-binary gender, by last count there are 9 non-binary genders, are displayed in the tables, 
        and accounted for in the full data set 
      </h5>

      <div className="input-area">
        <div>
          <p style={{border: "2px solid"}}>
            Note: As for January, 2016, only about 72% and 36% of biographies had date
            of birth and date of death, respectively, so this data is incomplete.
          </p>
        </div>
          
        <h6>Different Wikipedia Categories of Humans</h6>
          <ToggleButtonGroup type="radio" name="human-type" defaultValue={"all"} onChange={handleHumanChange}>
            <ToggleButton value={"all"} name="all" size="lg" variant="outline-dark">All Humans on Wikidata</ToggleButton>
            <ToggleButton value={"at-least-one"} name="at-least-one" size="lg" variant="outline-dark">Humans With Atleast One Wikipedia Article</ToggleButton>
            <ToggleButton value={"more-than-one"} name="at-least-one" size="lg" variant="outline-dark">Humans With More Than One Wikipedia Article</ToggleButton>
          </ToggleButtonGroup>
        
        <div>
          <ToggleButtonGroup type="radio" name="data-selection" defaultValue={"dob"} onChange={handleChange}> 
            <Form.Check
              type="radio"
              label="Gender by Date of Birth"
              name="gender-by-dob"
              value="gender-by-dob"
            />
            <Form.Check
              type="radio"
              label="Gender by Date of Death"
              name="gender-by-dod"
              value="gender-by-dod"
            />
          </ToggleButtonGroup>


          <ToggleButtonGroup type="checkbox" name="gender-selection" defaultValue={"female"} onChange={handleChange}>
            <Form.Check
              type="checkbox"
              label="Male"
              name="male"
              value="male"
            />
            <Form.Check
              type="checkbox"
              label="Female"
              name="female"
              value="female"
            />
            <Form.Check
              type="checkbox"
              label="Non Binary"
              name="non-binary"
              value="non-binary"
            />
          </ToggleButtonGroup>

        </div>
        <br />
        
        <LineChart />

        <br />

        <div className="table-container">
          <BootstrapTable 
            keyField='id' 
            data={ tableData } 
            columns={ columns } 
            filter={ filterFactory({ afterFilter }) } 
          />
        </div>

      </div>      


    </div>
  )
}

export default GenderByDOBView