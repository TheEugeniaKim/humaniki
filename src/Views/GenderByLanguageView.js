import React, { useState, useEffect } from 'react'
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap'

import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'

import languageCodes from '../Components/LanguageCodes.json'
import ScatterPlot from '../Components/ScatterPlot'

function GenderByLanguageView(){
  const [tableData, setTableData] = useState([])
  const [tableMetaData, setTableMetaData] = useState({})
  function fetchData(){
    // fetch("http://localhost:3000/v1/all-wikidata/gender/aggregated/2020-09-15/wikipedia-project/wikipedias/language.json")
    fetch('http://127.0.0.1:5000/v1/gender/gap/latest/all_wikidata/properties?project=all') 
      .then(response => response.json())
      .then(data => processData(data))
  }
  function processData(data){
    let arrOfLangObj = []
    const tableArr = [];
    for(let property in data["2018-01-08"]["GTE_ONE_SITELINK"]) {
      let obj = {}
      obj[property] = data["2018-01-08"]["GTE_ONE_SITELINK"][property]
      arrOfLangObj.push(obj)
    }
    let extrema = {
      percentMax: Number.NEGATIVE_INFINITY,
      percentMin: Number.POSITIVE_INFINITY,
      totalMax: Number.NEGATIVE_INFINITY,
      totalMin: Number.POSITIVE_INFINITY
    }
    arrOfLangObj.forEach((obj, index) => {
      let tableObj = {}
      let language = Object.keys(obj)[0]
      let totalValue = Object.values(obj[language]).reduce((a, b) => a + b)
      tableObj.key = index
      tableObj.language = language
      tableObj.total = totalValue
      tableObj.men = obj[language]["men"] ? obj[language]["men"] : 0
      tableObj.women = obj[language]["women"] ? obj[language]["women"]: 0
      tableObj.nonBinary = obj[language]["nonBinary"] ? obj[language]["nonBinary"]: 0
      tableObj.menPercent = tableObj["men"]/tableObj["total"]*100
      tableObj.womenPercent = tableObj["women"]/tableObj["total"]*100
      tableObj.nonBinaryPercent = tableObj["nonBinary"]/tableObj["total"]*100
      tableArr.push(tableObj)

      if (tableObj.womenPercent > extrema.percentMax) {
        console.log(tableObj.language, tableObj.womenPercent)
        extrema.percentMax = tableObj.womenPercent
      } else if (tableObj.womenPercent < extrema.percentMin) {
        extrema.percentMin = tableObj.womenPercent
      }

      if (tableObj.total > extrema.totalMax) {
        extrema.totalMax = tableObj.total
      } else if (tableObj.total < extrema.totalMin) {
        extrema.totalMin = tableObj.total
      }
    })
    setTableMetaData(extrema)
    setTableData(tableArr) 
    return true
  }

  useEffect(() => {
    fetchData()
  }, [])
  
  const columns = [{
    dataField: "language",
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
      <ScatterPlot 
        data={tableData} 
        extrema={tableMetaData}
      />
      <br />
      <div className="table-container">
        <BootstrapTable 
          keyField='key' 
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