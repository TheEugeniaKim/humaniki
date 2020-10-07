import React, { useState, useEffect } from 'react'
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap'

import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'

import languageCodes from '../Components/LanguageCodes.json'

function GenderByLanguageView(){
  const [tableData, setTableData] = useState([])
  let tableArr = []
  function fetchData(){
    fetch("http://localhost:3000/v1/all-wikidata/gender/aggregated/2020-09-15/wikipedia-project/wikipedias/language.json")
      .then(response => response.json())
      .then(data => processData(data))
  }
  function processData(data){
    languageCodes.forEach((language, index) => {
      // console.log("in loop", Object.keys(data))
      let languageCode = language.alpha2
      let num = data.length
      
      languageCodes[index]["men"] = data[languageCode]["men"]
      language["men"] = data[languageCode]["men"]
      language["women"] = data[languageCode]["women"]
      language["nonBinary"] = data[languageCode]["non-binary"]
      language["total"] = language.men + language.women + language.nonBinary
      language["menPercent"] = (language["men"]/language["total"]*100).toFixed(2)
      language["womenPercent"] = (language["women"]/language["total"]*100).toFixed(2)
      language["nonBinaryPercent"] = (language["nonBinary"]/language["total"]*100).toFixed(2)

      tableArr.push(language)
    })
    console.log(tableArr)
    return setTableData(tableArr) 
  }
  useEffect(() => {
    fetchData()
  }, [])
  
  const columns = [{
    dataField: "English",
    text: "Language",
    filter: textFilter()

  }, {
    dataField: "total",
    text: "Total",
    sort: true
    
  }, {
    dataField: "women",
    text: "Women",
    sort: true
  }, {
    dataField: "womenPercent",
    text: "Women (%)",
    sort: true
  }, {
    dataField: "men",
    text: "Men",
    sort: true
  }, {
    dataField: "menPercent",
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
          keyField='alpha2' 
          data={ tableData } 
          columns={ columns } 
          filter={ filterFactory({ afterFilter }) } 
          pagination={ paginationFactory() }
        />
      </div>

    </div>
  )
}

export default GenderByLanguageView