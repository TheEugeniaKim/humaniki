import React from 'react'
import { ToggleButtonGroup, ToggleButton, InputGroup, FormControl, Form, Row, Col, Table } from 'react-bootstrap'
import LineChart from '../Components/LineChart'

function GenderByDOBView(){
  
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

        <Table responsive="md">
        <thead>
          <tr>
            <th>Year of Birth</th>
            <th>Total</th>
            <th>Total with Gender</th>
            <th>Female</th>
            <th>Female (%)</th>
            <th>Male</th>
            <th>Male (%)</th>
            <th>Others</th>
            <th>Others (%)</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </Table>

      </div>      


    </div>
  )
}

export default GenderByDOBView