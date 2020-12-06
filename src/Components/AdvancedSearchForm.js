import React, {useState} from 'react'
import {Form, Row, Button } from 'react-bootstrap'
import allWikiProjects from '../allWikiProjects.json'
import allWikiCountries from '../allWikiCountries.json'

function AdvacnedSearchForm({onSubmit}){
  // console.log("props",props)
  const [formState, setFormState] = useState({
    "selectedSnapshot": "latest",
    "selectedYearRange": null,
    "selectedWikiProject": "all",
    "selectedCitizenship": "all",
    "selectedOccupation": null
  })

  const handleInputChange = (e) => setFormState({
    ...formState,
    [e.target.id]: e.target.value
  })

  function handleWikiInputChange(e){
    let handledEvent = {}
    console.log(e, lookupWikiProjectSelection(e.target.value))
    // lookupWikiProjectSelection(e)
  }

  function handleCitizenshipInputChange(e){
    console.log(lookupWikiProjectSelection(e.target.value))
  }

  function onClickReset(e){
    console.log(e)
    // setFormState({
    //   "selectedYearRange": null,
    //   "selectedSnapshot": null
    // })
    setFormState({
      "selectedSnapshot": null,
      "selectedYearRange": null,
      "selectedWikiProject": null,
      "selectedCitizenship": null,
      "selectedOccupation": null
    })


  }

  let allWikiCountriesTuples = allWikiCountries ? Object.entries(allWikiCountries) : null 
  let allWikiProjectsTuples = allWikiProjects ? Object.entries(allWikiProjects): null 
  allWikiProjectsTuples.unshift(["all","All"])
  allWikiCountriesTuples.unshift(["all","All"])

  function handleOnSubmit(e){
    e.preventDefault()
    console.log("Form State", formState)

    onSubmit(formState)
  }

  function lookupWikiProjectSelection(wikiProjectName){
    console.log(wikiProjectName)
    Object.keys(allWikiProjects).map(key => {
      if (allWikiProjects[key] === wikiProjectName){
        return key
      }
    })
  }

  function lookupWikiCitizenshipSelection(countryCode){
    console.log(countryCode)
    return allWikiCountries[countryCode]
  }
  
  return(
    <Form onSubmit={handleOnSubmit}>
      <Row>
        <Form.Group controlId="selectedSnapshot">
          <Form.Label>Timestamp</Form.Label>
          <Form.Control 
            type="text" 
            // placeholder="Latest"
            onChange={handleInputChange} 
            value={formState.selectedSnapshot === null ? "Latest" : formState.selectedSnapshot} 
            />
        </Form.Group>

        <Form.Group controlId="selectedYearRange">
          <Form.Label>Year of Birth '[YEAR]~[YEAR]'</Form.Label>
          <Form.Control 
            type="text"  
            onChange={handleInputChange} 
            value={formState.selectedYearRange === null ? "No Filter" : formState.selectedYearRange}
          />
        </Form.Group>

        <Form.Group controlId="selectedWikiProject">
          <Form.Label>Wiki Project</Form.Label>
          <Form.Control as="select" onChange={handleWikiInputChange} >
            {
              allWikiProjectsTuples.map(projectArr => 
                <option key={projectArr[0]}>{projectArr[1]}</option>  
              )
            }
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="selectedCitizenship">
          <Form.Label>Citizenship</Form.Label>
          <Form.Control as="select" onChange={handleInputChange} >
            {
              allWikiCountriesTuples.map(projectArr => 
                <option key={projectArr[0]}>{projectArr[1]}</option>  
              )
            }
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="selectedOccupation">
          <Form.Label>Occupation</Form.Label>
          <Form.Control as="select" onChange={handleInputChange} >
              <option>occupation options</option>
            </Form.Control>
        </Form.Group>

      </Row>
      <Row>

        <Button variant="primary" type="submit">
          Submit
        </Button>

        <Button variant="primary" onClick={onClickReset}>
          Reset
        </Button>
      </Row>
    </Form>
  )
}

export default AdvacnedSearchForm
