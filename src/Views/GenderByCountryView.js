import React, { useState } from 'react'
import WorldMap from '../Components/WorldMap'
import data from '../Components/WorldData.geo.json'
import { ToggleButtonGroup, ToggleButton, Table } from 'react-bootstrap'

function GenderByCountryView(){
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
          <ToggleButtonGroup type="radio" name="birthVsCitizenship" defaultValue={"birth"} onChange={handleChange}>
            <ToggleButton value={"birth"} name="birth" variant="outline-dark">Country of Birth</ToggleButton>
            <ToggleButton value={"citizenship"} name="citizenship" variant="outline-dark">Country of Citizenship</ToggleButton>
          </ToggleButtonGroup>  

          <br/>
        <h6>Different Wikipedia Categories of Humans</h6>
          <ToggleButtonGroup type="radio" name="human-type" defaultValue={"all"} onChange={handleHumanChange}>
            <ToggleButton value={"all"} name="all" size="lg" variant="outline-dark">All Humans on Wikipedia</ToggleButton>
            <ToggleButton value={"at-least-one"} name="at-least-one" size="lg" variant="outline-dark">Humans With Atleast One Wikipedia Article</ToggleButton>
            <ToggleButton value={"more-than-one"} name="at-least-one" size="lg" variant="outline-dark">Humans With More Than One Wikipedia Article</ToggleButton>
          </ToggleButtonGroup>
      </div>      

      <WorldMap data={data} />

      <Table responsive="md">
        <thead>
          <tr>
            <th>Country</th>
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

        
  )
}

export default GenderByCountryView 