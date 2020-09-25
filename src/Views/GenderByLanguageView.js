import React from 'react'
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap'

import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';


function GenderByLanguageView(){
  const tableData = [{
    id: 1, 
    country:"United States", 
    total: 84345324,
    totalWithGender: 24234352,
    women: 243503,
    WomenPercent: 23423,
    men: 30429424,
    MenPercent: 72,
    nonBinary: 32,
    nonBinaryPercent: 0
  }, {
    id: 2, 
    country: "Canada",
    total: 84345324,
    totalWithGender: 24234352,
    women: 243503,
    WomenPercent: 28,
    men: 30429424,
    MenPercent: 72,
    nonBinary: 32,
    nonBinaryPercent: 0
  }, {
    id: 3, 
    country: "Mexico",
    total: 84345324,
    totalWithGender: 24234352,
    women: 243503,
    WomenPercent: 28,
    men: 30429424,
    MenPercent: 72,
    nonBinary: 32,
    nonBinaryPercent: 0
  }]
  const columns = [{
    dataField: "country",
    text: "Country",
    filter: textFilter()

  }, {
    dataField: "total",
    text: "Total",
    sort: true
    
  }, {
    dataField: "totalWithGender",
    text: "Total With Gender",
    sort: true
  }, {
    dataField: "women",
    text: "Women",
    sort: true
  }, {
    dataField: "WomenPercent",
    text: "Women (%)",
    sort: true
  }, {
    dataField: "men",
    text: "Men",
    sort: true
  }, {
    dataField: "MenPercent",
    text: "Men (%)",
    sort: true
  }, {
    dataField: "nonBinary",
    text: "Non-binary",
    sort: true
  }, {
    dataField: "nonBinaryPercent",
    text: "Non-Binary (%)",
    sort: true
  }]

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }
  
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

      <br />
      <div className="table-container">
        <BootstrapTable 
          keyField='id' 
          data={ tableData } 
          columns={ columns } 
          filter={ filterFactory({ afterFilter }) } 
        />
      </div>

    </div>
  )
}

export default GenderByLanguageView