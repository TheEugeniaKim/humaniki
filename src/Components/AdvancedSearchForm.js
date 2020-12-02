import React, {useState} from 'react'
import {Form, Row, Button } from 'react-bootstrap'
import allWikiProjects from '../allWikiProjects.json'
import allWikiCountries from '../allWikiCountries.json'

function AdvacnedSearchForm(props){
  const [formState, setFormState] = useState({})

  const handleInputChange = (e) => setFormState({
    ...formState,
    [e.target.id]: e.target.value
  })

  let allWikiCountriesTuples = allWikiCountries ? Object.entries(allWikiCountries) : null 
  let allWikiProjectsTuples = allWikiProjects ? Object.entries(allWikiProjects): null 
  allWikiProjectsTuples.unshift(["all","All"])
  allWikiProjectsTuples.unshift([null,"No Filter"])
  allWikiCountriesTuples.unshift(["all","All"])
  allWikiCountriesTuples.unshift([null,"No Filter"])

  function onClickReset(e){
    setFormState({
      "selectedYearRange": null,
      "selectedSnapshot": null
    })
  }

  function lookupWikiProjectSelection(wikiCode){
    console.log(wikiCode)
    return allWikiProjects[wikiCode]
  }

  function lookupWikiCitizenshipSelection(countryCode){
    console.log(countryCode)
    return allWikiCountries[countryCode]
  }
  
  return(
    <Form onSubmit={formState => props.onSubmit}>
      <Row>
        <Form.Group controlId="selectedSnapshot">
          <Form.Label>Timestamp</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Latest"
            onChange={handleInputChange} 
            value={formState.selectedSnapshot === null ? "Latest" : formState.selectedSnapshot} 
            />
        </Form.Group>

        <Form.Group controlId="selectedYearRange">
          <Form.Label>Year of Birth '[YEAR]~[YEAR]'</Form.Label>
          <Form.Control 
            type="text"  
            placeholder="No Filter" 
            onChange={handleInputChange} 
            value={formState.selectedYearRange === null ? "No Filter" : formState.selectedYearRange}
          />
        </Form.Group>

        <Form.Group controlId="selectedWikiProject">
          <Form.Label>Wiki Project</Form.Label>
          <Form.Control as="select" onChange={handleInputChange} >
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
