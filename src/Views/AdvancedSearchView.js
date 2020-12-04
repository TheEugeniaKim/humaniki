import React, {useState, useEffect} from 'react'
import {Container, Row, Dropdown, DropdownButton, Button} from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { ToggleButtonGroup, ToggleButton, Form } from 'react-bootstrap'
import RadialBarChart from '../Components/RadialBarChartButton'
import AdvacnedSearchForm from '../Components/AdvancedSearchForm'
import SingleBarChart from '../Components/SingleBarChart'

function AdvancedSearchView(){
  const [selectedWikipediaHumanType, setSelectedWikipediaHumanType] = useState("all_wikidata")
  // const [formState, setFormState] = useState({})
  const [url, seturl] = useState("")
  const [tableColumns, setTableColumns] = useState([{dataField: "index", text: "Index", sort: true}])
  const [tableData, setTableData] = useState([])
  

  const onSubmit = (formState) => {
    console.log("Form state is: ", formState)
    setFetchURL(formState)
  }

  function setFetchURL(formState){
    // let url = `http://localhost:5000/v1/gender/gap/${formState.snapshot ? formState.snapshot : "latest"}/${selectedWikipediaHumanType}/properties?`
    // let url = `https://humaniki-staging.wmflabs.org/api/v1/gender/gap/${formState.snapshot ? formState.snapshot : "latest"}/${selectedWikipediaHumanType}/properties?`
    // let baseURL = "http://127.0.0.1:5000/v1/gender/gap/"

    let baseURL = process.env.REACT_APP_API_URL
    let url = `${baseURL}v1/gender/gap/${formState.selectedSnapshot ? formState.selectedSnapshot : "latest"}/${selectedWikipediaHumanType}/properties?`
    if (formState.selectedYearRange) {
      url = url + `&date_of_birth=${formState.selectedYearRange}`
    }

    if (formState.selectedWikiProject) {
      console.log(formState.selectedWikiProject)
      url = url + `&project=${formState.wikiProject}`
    }

    if (formState.selectedCitizenship) {
      url = url + `&citizenship=${formState.selectedCitizenship}`
    }

    url = url + `&label_lang=en`

    return seturl(url)
  }

  function handleHumanChange(event){
    if (event === "all") {
      setSelectedWikipediaHumanType("all-wikidata")
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
  function processFetchData(data){
    console.log("data process fetch", data)
    let tableArr = []
    //create columns
    columns.push({dataField: "index", text: "Index", sort: true})
    columns.push({dataField: "total", text: "Total", sort: true})
    columns.push({dataField: "gap", text: "Gap", sort: true, style: {
      width: '40px',
      overflow: 'visible'
    }})

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

    // configure data
    data.metrics.forEach((obj, index) => {
      let tableObj = {}
      delete obj["item_label"]["iso_3166"]
      tableObj.key = index
        let item_labels = Object.values(obj["item_label"])
        item_labels = item_labels.length > 0 ? item_labels : ["Overall"]
      tableObj.index = item_labels.join(", ")
      tableObj.total = Object.values(obj.values).reduce((a, b) => a + b)
      for (let genderId in data.meta.bias_labels){
        let label = data.meta.bias_labels[genderId]
        tableObj[label] = obj["values"][genderId] ? obj["values"][genderId] : 0 
        tableObj[label + "Percent"] = obj["values"][genderId] ? (obj["values"][genderId]/tableObj["total"])*100 : 0  
      }
      let genderTotalsArr = []
      console.log("HELLO", tableObj, obj)

      Object.values(data.meta.bias_labels).map(gender => gender + "Percent").map(g => genderTotalsArr.push(tableObj[g]))
      console.log("gender total arr", genderTotalsArr)
      tableObj.gap = <SingleBarChart genderTotals={genderTotalsArr} />
      tableArr.push(tableObj)
    })

    setTableColumns(columns)
    setTableData(tableArr)
  }

  useEffect(() => {
    if (!url) return
    fetch(url)
      .then(response => response.json())
      .then(data => processFetchData(data))
  }, [url])

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
        />

      </div>
      <SingleBarChart />

      <BootstrapTable
        keyField='total'
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
