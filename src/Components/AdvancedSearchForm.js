import React, {useState} from 'react'
import {Form, Row, Button } from 'react-bootstrap'
import allWikiProjects from '../allWikiProjects.json'
import allWikiCountries from '../allWikiCountries.json'

function AdvacnedSearchForm({onSubmit, snapshots}){
  const [formState, setFormState] = useState({
    "selectedSnapshot": null,
    "selectedYearRange": null,
    "selectedWikiProject": null,
    "selectedCitizenship": null,
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
        selectedCitizenship: "all"
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
  allWikiProjectsTuples.unshift([null,"No Filter"])
  allWikiCountriesTuples.unshift([null,"No Filter"])

  function lookupWikiProject(wikiQID){
    allWikiProjectsTuples.forEach(arr => {
      if (arr[0] === wikiQID) {
        return arr[1]
      }
    })
  }

  function lookupCitizenship(citizenshipId){
    allWikiCountriesTuples.forEach(arr => {
      if (arr[0] === citizenshipId){
        return arr[1]
      }
    })
  }
  
  function formatDate(date){
    return date.substring(0,4) + "-" + date.substring(4,6) + "-" + date.substring(6,8)
  }

  function handleOnSubmit(e){
    e.preventDefault()
    console.log("IN HANDLE ONSUBMIT")
    console.log(formState.selectedWikiProject, formState.selectedCitizenship, formState.selectedYearRange)
    if (formState.selectedWikiProject && formState.selectedCitizenship && formState.selectedYearRange){
      alert("You've selected too many dimensions. Currently Humaniki only supports two dimensional searches")
    } else {
      onSubmit(formState)
    }
    console.log("Form State", formState)
  }
  return(
    <Form onSubmit={handleOnSubmit}>
      <Row>
        <Form.Group controlId="selectedSnapshot">
          <Form.Label>Timestamp (YYYY-DD-MM)</Form.Label>
          <Form.Control as="select" onChange={handleSnapshotChange} value={formState.selectedSnapshot ? formatDate(formState.selectedSnapshot) : "latest"}>
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
            value={formState.selectedYearRange === null ? "YYYY~YYYY" : formState.selectedYearRange}
          />
        </Form.Group>

        <Form.Group controlId="selectedWikiProject">
          <Form.Label>Wiki Project</Form.Label>
          <Form.Control as="select" onChange={handleWikiInputChange} value={formState.selectedWikiProject ? lookupWikiProject(formState.selectedWikiProject) : "No Filter"}>
            {
              allWikiProjectsTuples.map(projectArr => 
                <option key={projectArr[0]}>{projectArr[1]}</option>  
              )
            }
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="selectedCitizenship">
          <Form.Label>Citizenship</Form.Label>
          <Form.Control as="select" onChange={handleCitizenshipInputChange} value={formState.selectedCitizenship ? lookupCitizenship(formState.selectedCitizenship) : "No Filter"}>
            {
              allWikiCountriesTuples.map(projectArr => 
                <option key={projectArr[0]} >{projectArr[1]}</option>  
              )
            }
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="selectedOccupation">
          <Form.Label>Occupation</Form.Label>
          <Form.Control as="select" onChange={handleInputChange} value={formState.selectedOccupation ? formState.selectedOccupation : "Occupation"}>
            <option>No Filter</option>
          </Form.Control>
        </Form.Group>

      </Row>
      <Row>

        <Button variant="primary" type="submit" onSubmit={handleOnSubmit}>
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
