import React from 'react'
import { ToggleButtonGroup, ToggleButton, InputGroup, FormControl, Form, Row, Col } from 'react-bootstrap'

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
          <Form>
            <Form.Group as={Row}>
              <Form.Label as="legend" column sm={2}>
                Data Selection
              </Form.Label>
              <Col sm={10}>
                <Form.Check
                  type="radio"
                  label="Gender by Date of Birth"
                  name="gender-by-dob"
                  id="gender-by-dob"
                />
                <Form.Check
                  type="radio"
                  label="Gender by Date of Death"
                  name="gender-by-dod"
                  id="gender-by-dod"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label as="legend" column sm={2}>
                Gender Selection
              </Form.Label>
              <Col sm={10}>
                <Form.Check
                  type="checkbox"
                  label="Male"
                  name="male"
                  id="male"
                />
                <Form.Check
                  type="checkbox"
                  label="Female"
                  name="female"
                  id="female"
                />
                <Form.Check
                  type="checkbox"
                  label="Non Binary"
                  name="non-binary"
                  id="non-binary"
                />
              </Col>
            </Form.Group>
          </Form>
        </div>

      </div>      


    </div>
  )
}

export default GenderByDOBView