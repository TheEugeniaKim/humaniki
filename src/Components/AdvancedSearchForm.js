import React, {useState} from 'react'
import {Form, Row, Button } from 'react-bootstrap'
import allWikiProjects from '../allWikiProjects.json'
import allWikiCountries from '../allWikiCountries.json'

function AdvacnedSearchForm({onSubmit, snapshots}){
  const [formState, setFormState] = useState({
    "selectedSnapshot": "latest",
    "selectedYearRange": null,
    "selectedWikiProject": "all",
    "selectedCitizenship": "all",
    "selectedOccupation": null
  })

  const handleSnapshotChange = (e) => setFormState({
    ...formState,
    [e.target.id]: e.target.value.replace(/-/g, "")
  })

  const handleInputChange = (e) => setFormState({
    ...formState,
    [e.target.id]: e.target.value
  })

  function handleWikiInputChange(e){
    if (e.target.value === "All"){
      setFormState({
        ...formState, 
        selectedWikiProject: "all"
      })
    } else {
      allWikiProjectsTuples.map(arr => {
        if (arr[1] === e.target.value){
          console.log("setting state")
          setFormState({
            ...formState, 
            selectedWikiProject: arr[0]
          })
        }
      })
    }
  }

  function handleCitizenshipInputChange(e){
    if (e.target.value === "All"){
      setFormState({
        ...formState, 
        selectedWikiProject: "all"
      })
    } else {
      allWikiCountriesTuples.map(arr => {
        if (arr[1] === e.target.value) {
          setFormState({
            ...formState,
            selectedCitizenship: arr[0]
          })
        }  
      })
    }
    console.log("formstate", formState)
  }

  function onClickReset(e){
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
    setFormState({
      "selectedSnapshot": null,
      "selectedYearRange": null,
      "selectedWikiProject": null,
      "selectedCitizenship": null,
      "selectedOccupation": null
    })
    onSubmit(formState)
  }
  
  return(
    <Form onSubmit={handleOnSubmit}>
      <Row>
        <Form.Group controlId="selectedSnapshot">
          <Form.Label>Timestamp (YYYY-DD-MM)</Form.Label>
          <Form.Control as="select" onChange={handleSnapshotChange} >
            {
              snapshots.map(snapshot =>
                <option key={snapshot.id}>{snapshot.date}</option>  
              )
            }
          </Form.Control>
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
          <Form.Control as="select" onChange={handleCitizenshipInputChange} >
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
