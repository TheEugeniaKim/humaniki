import React, { useState, useEffect } from 'react'
import { ToggleButtonGroup, ToggleButton, InputGroup, FormControl, Container} from 'react-bootstrap'

import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'

import ScatterPlot from '../Components/ScatterPlot'

function GenderByLanguageView({API}){
  const [tableData, setTableData] = useState([])
  const [tableMetaData, setTableMetaData] = useState({})
  const [tableColumns, setTableColumns] = useState([])
  const [snapshot, setSnapshot] = useState("latest")
  const [isLoading, setIsLoading] = useState(true)
  const [isErrored, setIsErrored] = useState(false)

  function handleSnapshot(e){
    setSnapshot(e.target.value)
  }

  function processData(err, data){
    if (err) {
      setIsErrored(true)
    } else {
      const tableArr = []
      const columns = []
      const extrema = {
        percentMax: Number.NEGATIVE_INFINITY,
        percentMin: Number.POSITIVE_INFINITY,
        totalMax: Number.NEGATIVE_INFINITY,
        totalMin: Number.POSITIVE_INFINITY
      }

      function percentFormatter(cell,row){
        if (!cell){
          return
        }
        return cell.toFixed(3)
      }

      columns.push({dataField: "language", text: "Language", filter: textFilter()})
      columns.push({dataField: "total",text: "Total",sort: true})
      for (let genderId in data.meta.bias_labels) {
        let obj = {
          dataField: data.meta.bias_labels[genderId],
          text: data.meta.bias_labels[genderId],
          sort: true
        }
        let objPercent = {
          dataField: data.meta.bias_labels[genderId] + "Percent",
          text: data.meta.bias_labels[genderId] + " Percent",
          sort: true,
          formatter: percentFormatter
        }
        obj.label = data.meta.bias_labels[genderId]
        columns.push(obj)
        columns.push(objPercent)
      }

      data.metrics.forEach((obj, index) => {
        let tableObj = {}
        tableObj.key = index
        tableObj.language = obj.item_label.project
        tableObj.total = Object.values(obj.values).reduce((a, b) => a + b)
        for (let genderId in data.meta.bias_labels) {
          let label = data.meta.bias_labels[genderId]
          tableObj[label] = obj["values"][genderId] ? obj["values"][genderId] : 0 
          tableObj[label + "Percent"] = obj["values"][genderId] ? (obj["values"][genderId]/tableObj["total"])*100 : 0
        }
        tableArr.push(tableObj)
      
        let nonMalePercent = 100 - tableObj.malePercent
        if (nonMalePercent > extrema.percentMax) {
          extrema.percentMax = nonMalePercent
        } else if (nonMalePercent < extrema.percentMin) {
          extrema.percentMin = nonMalePercent
        }

        if (tableObj.total > extrema.totalMax) {
          extrema.totalMax = tableObj.total
        } else if (tableObj.total < extrema.totalMin) {
          extrema.totalMin = tableObj.total
        }
      })
      
      setTableMetaData(extrema)
      setTableData(tableArr) 
      setTableColumns(columns)
    }
    setIsLoading(false)
    return true
  }

  useEffect(() => {
    API.get({
      bias: "gender",
      metric: "gap",
      snapshot: "latest",
      population: "gte_one_sitelink",
      property_obj: {project: "all", label_lang: "en"}
    }, processData)
  }, [snapshot])
  
  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }
  
  function handleHumanChange(){
    console.log("Handling human change")
  }

  const errorDiv = <div>Error</div>
  const loadingDiv = <div>Loading</div>

  return (
    <Container className="view-container">
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
          </ToggleButtonGroup>
          <InputGroup className="mb-3" size="sm" controlId="years">
            <InputGroup.Prepend>
              <InputGroup.Text>Snapshot:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl type="text" placeholder={snapshot} onChange={handleSnapshot} />
          </InputGroup>
      </div>
      <div className="scatter-wrapper">
        <ScatterPlot 
          data={tableData}
          extrema={tableMetaData}
          columns={tableColumns}
        />
      </div>
      <br />
      <div className="table-container">
        {isLoading ? loadingDiv : null }
        {isErrored ? errorDiv : null }
        {
          tableColumns.length === 0 ? null :
          <BootstrapTable 
            keyField='key' 
            data={ tableData } 
            columns={ tableColumns } 
            filter={ filterFactory({ afterFilter }) } 
            pagination={ paginationFactory() }
            className='table'
          />
        }
      </div>
    </Container>
  )
}

export default GenderByLanguageView