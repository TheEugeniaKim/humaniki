import React from 'react'
import { ToggleButtonGroup, ToggleButton, InputGroup, FormControl, Form, Row, Col } from 'react-bootstrap'


function GenderByLanguageView(){

  function handleHumanChange(){
    console.log("Handling human change")
  }

  return (
    <div>
      <h1>Gender Gap By Wikipedia Language Editions</h1>
      <h5>
        This plot shows the Language each biography is written in Wikidata, 
        by gender, non-binary gender, by last count there are 9 non-binary genders, 
        are displayed in the tables, and accounted for in the full data set 
      </h5>

      <div>
        <p style={{border: "2px solid"}}>
          Note: As for January, 2016, only about 72% and 36% of biographies had date
          of birth and date of death, respectively, so this data is incomplete.
        </p>
      </div>

      <div className="input-area">
        <h6>Different Wikipedia Categories of Humans</h6>
          <ToggleButtonGroup type="radio" name="human-type" defaultValue={"all"} onChange={handleHumanChange}>
            <ToggleButton value={"all"} name="all" size="lg" variant="outline-dark">All Humans on Wikidata</ToggleButton>
            <ToggleButton value={"at-least-one"} name="at-least-one" size="lg" variant="outline-dark">Humans With Atleast One Wikipedia Article</ToggleButton>
            <ToggleButton value={"more-than-one"} name="at-least-one" size="lg" variant="outline-dark">Humans With More Than One Wikipedia Article</ToggleButton>
          </ToggleButtonGroup>
      </div>
    </div>
  )
}

export default GenderByLanguageView