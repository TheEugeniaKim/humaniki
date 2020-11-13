import React, {useState, useEffect} from 'react'
import {Row, Dropdown, DropdownButton, Button} from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { ToggleButtonGroup, ToggleButton, Form } from 'react-bootstrap'
import RadialBarChart from '../Components/RadialBarChartButton'


function AdvancedSearchView(){
  const [selectedWikipediaHumanType, setSelectedWikipediaHumanType] = useState("all")

  function onSelectCapture(e) {
    console.log("caputre", e)
  }
  function handleHumanChange(event){
    if (event === "all") {
      setSelectedWikipediaHumanType("all-wikidata")
    } else if (event === "at-least-one") {
      setSelectedWikipediaHumanType("at-least-one")
    } else if (event === "more-than-one") {
      setSelectedWikipediaHumanType("more-than-one")
    }
  }

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }
  const tableArr = []

  const columns = [{
      dataField: "total", 
      text: "Total", 
      filter: textFilter()
    },{
      dataField: "totalWithGender", 
      text: "Total With Gender", 
      filter: textFilter()
    }, {
      dataField: "women", 
      text: "Women", 
      filter: textFilter()
    }, { 
      dataField: "womenPercent", 
      text: "Women Percent", 
      filter: textFilter()
    }, {
      dataField: "gap", 
      text: "Gap", 
      filter: textFilter()
    }, {
      dataField: "men", 
      text: "Men", 
      filter: textFilter()
    }, {
      dataField: "menPercent", 
      text: "Men Percent", 
      filter: textFilter()
    }

  ]

  useEffect(() => {
    fetch("https://humaniki-staging.wmflabs.org/api/v1/gender/gap/latest/gte_one_sitelink/properties?project=all")
      .then(response => response.json())
      .then(data => console.log(data))
  }, [])
  return (
    <div>
      <h1>Advanced Search</h1>

      <div className="human-div">
        <h6>Different Wikipedia Categories of Humans</h6>
        <ToggleButtonGroup type="radio" name="human-type" defaultValue={"all"} onChange={handleHumanChange}>
            <ToggleButton value={"all"} name="all" size="lg" variant="outline-dark">All Humans on Wikidata</ToggleButton>
            <ToggleButton value={"at-least-one"} name="at-least-one" size="lg" variant="outline-dark">Humans With Atleast One Wikipedia Article</ToggleButton>
            <ToggleButton value={"more-than-one"} name="at-least-one" size="lg" variant="outline-dark">Humans With More Than One Wikipedia Article</ToggleButton>
          </ToggleButtonGroup>
      </div>

      <div className="input-area">
        <Row>
          <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          </Form>
          <DropdownButton title="Select Wiki Project" onSelect={onSelectCapture}>
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </DropdownButton>

          <DropdownButton id="Select Year of Birth" title="Dropdown button">
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </DropdownButton>

          <DropdownButton id="Select Country" title="Dropdown button">
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </DropdownButton>
        </Row>
      </div>

      <BootstrapTable 
        keyField='total' 
        data={ tableArr } 
        columns={ columns } 
        filter={ filterFactory({ afterFilter }) } 
        pagination={ paginationFactory(10) }
      />
      
    </div>
  )
}

export default AdvancedSearchView