import React, {useEffect} from 'react'
import {Form, Row, Button, Dropdown, DropdownButton} from 'react-bootstrap'
import DropdownComponent from './DropdownComponent'
import allWikiProjects from '../allWikiProjects.json'
import allWikiCountries from '../allWikiCountries.json'

function AdvacnedSearchForm(props){
  let allWikiCountriesTuples = allWikiCountries ? Object.entries(allWikiCountries) : null 
  let allWikiProjectsTuples = allWikiProjects ? Object.entries(allWikiProjects): null 
  allWikiProjectsTuples.unshift(["all","All"])
  allWikiCountriesTuples.unshift(["all","All"])

  function onChangeTimestamp(e){
    props.setSelectedSnapshot(e.target.value)
  }

  function onChangeYear(e) {
    props.setSelectedYear(e.target.value)
  }

  function onSelectProject(eventKey, event){
    console.log(eventKey, event)
    props.setSelectedWikiProject(eventKey)
  }

  function onSelectCitizenship(e){
    console.log(e)
    props.setSelectedCitizenship(e)
  }

  function onSelectOccupation(eventKey, event){
    props.setSelectedOccupation(eventKey)
  }

  function onClickReset(e){
    props.setSelectedSnapshot(null)
    props.setSelectedYear(null)
    props.setSelectedWikiProject(null)
    props.setSelectedCitizenship(null)
    props.setSelectedOccupation(null)
  }

  function lookupWikiProjectSelection(wikiCode){
    return allWikiProjects[wikiCode]
  }

  function lookupWikiCitizenshipSelection(countryCode){
    return allWikiCountries[countryCode]
  }
  const wikiProjectDropdownTitle =  props.selectedWikiProject === null ? "No Filter" : lookupWikiProjectSelection(props.selectedWikiProject)

  const wikiCitizenshipDropdownTitle = props.selectedCitizenship === null ? "No Filter" : lookupWikiCitizenshipSelection(props.selectedCitizenship)

  const occupationDropdownTitle = props.selectedOccupation == null ? "No Filter" : "insert options data"
  return(
    <Form onSubmit={props.onSubmit}>
      <Row>
        <Form.Group controlId="selectedSnapshot">
          <Form.Label>Timestamp</Form.Label>
          <Form.Control type="text" placeholder={props.selectedSnapshot === null ? props.selectedSnapshot: "Latest"} onChange={onChangeTimestamp} />
        </Form.Group>

        <Form.Group controlId="selectedYearRange">
          <Form.Label>Year of Birth '[YEAR]~[YEAR]'</Form.Label>
          <Form.Control type="text"  placeholder={props.selectedYear ? props.selectedYear : "No filter"} onChange={onChangeYear} />
        </Form.Group>

        <Form.Group controlId="selectedWikiProject">
          <Form.Label>Wiki Project</Form.Label>
          <DropdownButton
            id="selectedWikiProject"
            title={wikiProjectDropdownTitle}
            className="dropdown"
            onSelect={onSelectProject}
          >
          <DropdownComponent options={allWikiProjectsTuples} />
          </DropdownButton>
        </Form.Group>

        <Form.Group controlId="selectedCitizenship">
          <Form.Label>Citizenship</Form.Label>

          <DropdownButton
            id="selectedCitizenship"
            title={wikiCitizenshipDropdownTitle}
            className="dropdown"
            onSelect={onSelectCitizenship}
          >
          <DropdownComponent options={allWikiCountriesTuples} />
          </DropdownButton>
        </Form.Group>

        <Form.Group controlId="selectedOccupation">
        <Form.Label>Occupation</Form.Label>
          <DropdownButton
            id="selectedOccupation"
            title={occupationDropdownTitle}
            className="dropdown"
            onSelect={onSelectOccupation}
          >
            <DropdownComponent options={["options here"]} />
          </DropdownButton>
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
