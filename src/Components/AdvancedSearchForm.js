import React, { useState } from "react";
import { Form, Row, Button } from "react-bootstrap";
import allWikiProjects from "../allWikiProjects.json";
import allWikiCountries from "../allWikiCountries.json";
import {formatDate} from '../utils'

function AdvacnedSearchForm({ onSubmit, snapshots }) {
  const [formState, setFormState] = useState({
    selectedSnapshot: null,
    selectedYearRange: null,
    // year range will be null or "all" for full year or string "startEnd" which means to construct a start~end string
    selectedYearRangeStart: "", 
    selectedYearRangeEnd: "",
    selectedWikiProject: null,
    selectedCitizenship: null,
    selectedOccupation: null,
  });

  const handleSnapshotChange = (e) =>
    setFormState({
      ...formState,
      [e.target.id]: e.target.value.replace(/-/g, ""),
    });

  const handleSelectedYearRange = (e) => { 
    if (e.target.value === "all"){
      setFormState({
        ...formState, 
        selectedYearRange: "all"
      })
    } else if (e.target.value === "startEnd"){
      setFormState({
        ...formState, 
        selectedYearRange: "startEnd"
      }) 
    } else if (e.target.value === "No Filter"){
      setFormState({
        ...formState,
        selectedYearRange: null
      })
    }
  }

  const handleSelectedYearRangeTextInput = (e) => {
    if (e.target.id === "yearStart"){
      setFormState({
        ...formState, 
        selectedYearRangeStart: e.target.value
      })
    } else if (e.target.id === "yearEnd"){
      setFormState({
        ...formState,
        selectedYearRangeEnd: e.target.value
      })
    }
  }

  function handleWikiInputChange(e) {
    if (e.target.value === "All") {
      setFormState({
        ...formState,
        selectedWikiProject: "all",
      });
    } else {
      allWikiProjectsTuples.map((arr) => {
        if (arr[1] === e.target.value) {
          setFormState({
            ...formState,
            selectedWikiProject: arr[0],
          });
        }
      });
    }
  }

  function handleCitizenshipInputChange(e) {
    if (e.target.value === "All") {
      setFormState({
        ...formState,
        selectedCitizenship: "all",
      });
    } else {
      allWikiCountriesTuples.map((arr) => {
        if (arr[1] === e.target.value) {
          setFormState({
            ...formState,
            selectedCitizenship: arr[0],
          });
        }
      });
    }
  }

  function onClickReset(e) {
    setFormState({
      selectedSnapshot: null,
      selectedYearRange: null,
      selectedYearRangeStart: "",
      selectedYearRangeEnd: "",
      selectedWikiProject: null,
      selectedCitizenship: null,
      selectedOccupation: null,
    });
  }

  let allWikiCountriesTuples = allWikiCountries
    ? Object.entries(allWikiCountries)
    : null;
  let allWikiProjectsTuples = allWikiProjects
    ? Object.entries(allWikiProjects)
    : null;
  allWikiProjectsTuples.unshift(["all", "All"]);
  allWikiCountriesTuples.unshift(["all", "All"]);
  allWikiProjectsTuples.unshift([null, "No Filter"]);
  allWikiCountriesTuples.unshift([null, "No Filter"]);

  function lookupWikiProject(wikiQID) {
    allWikiProjectsTuples.forEach((arr) => {
      if (arr[0] === wikiQID) {
        return arr[1];
      }
    });
  }

  function lookupCitizenship(citizenshipId) {
    allWikiCountriesTuples.forEach((arr) => {
      if (arr[0] === citizenshipId) {
        return arr[1];
      }
    });
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    if (
      formState.selectedWikiProject &&
      formState.selectedCitizenship &&
      formState.selectedYearRange
    ) {
      alert(
        "You've selected too many dimensions. Currently Humaniki only supports two dimensional searches"
      );
    } else {
      onSubmit(formState);
      setFormState({
        selectedSnapshot: null,
        selectedYearRange: null,
        selectedYearRangeStart: null,
        selectedYearRangeEnd: null,
        selectedWikiProject: null,
        selectedCitizenship: null,
        selectedOccupation: null,
      });
    }
  }

  const snapshotFormGroup = snapshots ? (
    <Form.Group controlId="selectedSnapshot">
      <Form.Label>Timestamp (YYYY-DD-MM)</Form.Label>
      <Form.Control
        as="select"
        onChange={handleSnapshotChange}
        value={
          formState.selectedSnapshot
            ? formatDate(formState.selectedSnapshot)
            : "latest"
        }
      >
        {
          snapshots.map((snapshot, index) => (
            <option key={snapshot.id}>{index === 0 ?  formatDate(snapshot.date)+" (latest)" : formatDate(snapshot.date) }</option>
          ))
        }
      </Form.Control>
    </Form.Group>
  ) : <div> snapshots loading </div>
  ;

  return (
    <Form onSubmit={handleOnSubmit}>
      <Row>
        {snapshotFormGroup}
        <Form.Group>
          <Form.Label>Year of Birth '[YEAR]~[YEAR]'</Form.Label>
          <Form.Check 
            type="radio"
            value="No Filter"
            label="No Filter"
            id="noFilter"
            name="selectedYearRangeType"
            defaultChecked
            checked={formState.selectedYearRange===null}
            onChange={handleSelectedYearRange}
          />
          <Form.Check 
            type="radio"
            value="all"
            label="All"
            id="all"
            name="selectedYearRangeType"
            checked={formState.selectedYearRange === "all"}
            onChange={handleSelectedYearRange}
          />
          <Form.Check 
            type="radio"
            value="startEnd"
            label="From:"
            id="range"
            name="selectedYearRangeType"
            checked={formState.selectedYearRange === "startEnd"}
            onChange={handleSelectedYearRange}
          />
          <Form.Control
            type="text"
            onChange={handleSelectedYearRangeTextInput}
            value={formState.selectedYearRangeStart}
            placeholder="YYYY"
            id="yearStart"
            disabled={formState.selectedYearRange === "startEnd" ? false : true}
          />
          <Form.Label>To: </Form.Label>
          <Form.Control
            type="text"
            onChange={handleSelectedYearRangeTextInput}
            value={formState.selectedYearRangeEnd}
            placeholder="YYYY"
            id="yearEnd"
            disabled={formState.selectedYearRange === "startEnd" ? false : true}
          />
        </Form.Group>

        <Form.Group controlId="selectedWikiProject">
          <Form.Label>Wiki Project</Form.Label>
          <Form.Control
            as="select"
            onChange={handleWikiInputChange}
            value={
              formState.selectedWikiProject
                ? lookupWikiProject(formState.selectedWikiProject)
                : "No Filter"
            }
          >
            {allWikiProjectsTuples.map((projectArr) => (
              <option key={projectArr[0]}>{projectArr[1]}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="selectedCitizenship">
          <Form.Label>Citizenship</Form.Label>
          <Form.Control
            as="select"
            onChange={handleCitizenshipInputChange}
            value={
              formState.selectedCitizenship
                ? lookupCitizenship(formState.selectedCitizenship)
                : "No Filter"
            }
          >
            {allWikiCountriesTuples.map((projectArr) => (
              <option key={projectArr[0]}>{projectArr[1]}</option>
            ))}
          </Form.Control>
        </Form.Group>

      </Row>
      <Row>
        <Button variant="primary" type="submit" onSubmit={handleOnSubmit}>
          Submit
        </Button>

        <Button variant="secondary" onClick={onClickReset}>
          Reset
        </Button>
      </Row>
    </Form>
  );
}

export default AdvacnedSearchForm;
