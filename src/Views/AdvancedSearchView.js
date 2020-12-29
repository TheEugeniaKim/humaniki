import React, {useState, useEffect} from 'react'
import {Container} from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { ToggleButtonGroup, ToggleButton, Form } from 'react-bootstrap'
import AdvacnedSearchForm from '../Components/AdvancedSearchForm'
import SingleBarChart from '../Components/SingleBarChart'

function AdvancedSearchView({API, snapshots}){
  const [selectedWikipediaHumanType, setSelectedWikipediaHumanType] = useState("all_wikidata")
  const baseURL = process.env.REACT_APP_API_URL
  // const [url, seturl] = useState(`${baseURL}/v1/gender/gap/latest/gte_one_sitelink/properties?&label_lang=en`)
  const [fetchObj, setFetchObj] = useState({
    bias: "gender",
    metric: "gap",
    snapshot: "latest",
    population: "gte_one_sitelink",
    property_obj: null
  })
  const [formObj, setFormObj] = useState({})
  const [tableColumns, setTableColumns] = useState([{dataField: "index", text: "Index", sort: true}])
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isErrored, setIsErrored] = useState(false)

  const onSubmit = (formState) => {
    let tempPropertyObj = {
      bias: "gender",
      metric: "gap",
      snapshot: "latest",
      population: "gte_one_sitelink",
      property_obj: {}
    }
    if (formState.selectedSnapshot){
      tempPropertyObj.snapshot = formState.selectedSnapshot
    }
    console.log("formState", formState)
    if (formState.selectedCitizenship){
      tempPropertyObj["property_obj"]["citizenship"] = formState.selectedCitizenship
    } 
    if (formState.selectedWikiProject){
      tempPropertyObj["property_obj"]["project"] = formState.selectedWikiProject
    }
    if (formState.selectedYearRange){
      tempPropertyObj["property_obj"]["date_of_birth"] = formState.selectedYearRange
    }
    if (Object.keys(tempPropertyObj["property_obj"]).length === 0){
      tempPropertyObj["property_obj"] = null
    }
    setFetchObj(tempPropertyObj)
  }

  function handleHumanChange(event){
    if (event === "all") {
      setSelectedWikipediaHumanType("all_wikidata")
    } else if (event === "at-least-one") {
      setSelectedWikipediaHumanType("gte_one_sitelink")
    }
  }

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }

  function percentFormatter(cell, row){
    if (!cell){
      return
    }
    return cell.toFixed(3)
  }

  const columns = []

  function sortColumns(columns){
    let maleObj = columns.filter(obj => obj.text === "male")[0]
    let maleIndex = columns.findIndex(obj => obj.text === "male")
    columns.splice(maleIndex, 1)
    columns.splice(3, 0, maleObj)

    let malePercentObj = columns.filter(obj => obj.text === "male Percent")[0]
    let malePercentIndex = columns.findIndex(obj => obj.text === "male Percent")
    columns.splice(malePercentIndex, 1)
    columns.splice(4,0,malePercentObj)
   
    let femaleObj = columns.filter(obj => obj.text === "female")[0]
    let femaleIndex = columns.findIndex(obj => obj.text === "female")
    columns.splice(femaleIndex, 1)
    columns.splice(5,0,femaleObj)

    let femalePercentObj = columns.filter(obj => obj.text === "female Percent")[0]
    let femalePercentIndex = columns.findIndex(obj => obj.text === "female Percent")
    columns.splice(femalePercentIndex, 1)
    columns.splice(6,0,femalePercentObj)
  }

  function processFetchData(err,resData){
    if (err){
      setIsErrored(true)
    } else {
      if (!resData) return
      if (!snapshots) return
      console.log("resData:",resData, "snapshotData:", snapshots)
      
      let tableArr = []
      //create columns
      columns.push({dataField: "index", text: "Index", sort: true, filter: textFilter(), headerStyle: {"minWidth": "200px", "width": "20%"}})
      columns.push({dataField: "total", text: "Total", sort: true})
      columns.push({dataField: "gap", text: "Gap", sort: true, headerStyle: {
        "overflow": 'visible',
        "minWidth": "200px", 
        "width": "20%"
      }})

      for (let i=0; i< Object.keys(resData["meta"]["bias_labels"]).length; i++) {
        let genderId = Object.keys(resData["meta"]["bias_labels"])[i]
        console.log(resData.meta.bias_labels[genderId])
        if (resData.meta.bias_labels[genderId]===null){
          let obj = {
            dataField: genderId,
            text: genderId,
            sort: true
          }
          let objPercent = {
            dataField: genderId + "Percent",
            text: genderId + " Percent",
            sort: true,
            formatter: percentFormatter
          }
          obj.label = resData.meta.bias_labels[genderId]
          columns.push(obj)
          columns.push(objPercent)
        } else {
          let obj = {
            dataField: resData.meta.bias_labels[genderId],
            text: resData.meta.bias_labels[genderId],
            sort: true
          }
          let objPercent = {
            dataField: resData.meta.bias_labels[genderId] + "Percent",
            text: resData.meta.bias_labels[genderId] + " Percent",
            sort: true,
            formatter: percentFormatter
          }
          obj.label = resData.meta.bias_labels[genderId]
          columns.push(obj)
          columns.push(objPercent)
        }
      
      }
      // configure data
      resData.metrics.forEach((obj, index) => {
        let tableObj = {}
        delete obj["item_label"]["iso_3166"]
        tableObj.key = index
          let item_labels = Object.values(obj["item_label"])
          item_labels = item_labels.length > 0 ? item_labels : ["Overall"]
        tableObj.index = item_labels.length > 1 ? item_labels.join(", ") : item_labels[0]
        tableObj.total = Object.values(obj.values).reduce((a, b) => a + b)
        for (let genderId in resData.meta.bias_labels){
          let label = resData.meta.bias_labels[genderId]
          tableObj[label] = obj["values"][genderId] ? obj["values"][genderId] : 0 
          tableObj[label + "Percent"] = obj["values"][genderId] ? (obj["values"][genderId]/tableObj["total"])*100 : 0  
        }
        let genderTotalsArr = []

        Object.values(resData.meta.bias_labels).map(gender => gender + "Percent").map(g => genderTotalsArr.push(tableObj[g]))
        console.log("Gender totals arr", genderTotalsArr)
        tableObj.gap = <SingleBarChart genderTotals={genderTotalsArr} />
        tableArr.push(tableObj)
      })
      sortColumns(columns)
      setTableColumns(columns)
      setTableData(tableArr)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!snapshots){
      return
    }
    console.log('fetch obj', fetchObj)

    API.get(fetchObj, processFetchData)
  }, [fetchObj, snapshots])

  return (
    <Container className="view-container">
      <h1>Advanced Search</h1>

      <div className="human-div">
        <h6>Different Wikipedia Categories of Humans</h6>
        <ToggleButtonGroup type="radio" name="human-type" defaultValue={"all"} onChange={handleHumanChange}>
          <ToggleButton value={"all"} name="all" size="lg" variant="outline-dark">All Humans on Wikidata</ToggleButton>
          <ToggleButton value={"at-least-one"} name="at-least-one" size="lg" variant="outline-dark">Humans With Atleast One Site Link</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="input-area">
        <AdvacnedSearchForm
          onSubmit={onSubmit}
          snapshots={snapshots}
        /> 
      </div>

      <BootstrapTable
        keyField="index" 
        data={ tableData }
        columns={ tableColumns }
        filter={ filterFactory({ afterFilter }) }
        pagination={ paginationFactory(10) }
        noDataIndication="Table is Empty"
      />

    </Container>
  )
}

export default AdvancedSearchView
