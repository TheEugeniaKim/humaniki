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
  const [formState, setFormState] = useState({})
  const [url, seturl] = useState("")
  const [tableColumns, setTableColumns] = useState([{dataField: "index", text: "Index", sort: true}])
  const [tableData, setTableData] = useState([])

  const [selectedSnapshot, setSelectedSnapshot] = useState("Enter Date - Latest")
  const [selectedYear, setSelectedYear] = useState("Enter Date - Latest")
  const [selectedWikiProject, setSelectedWikiProject] = useState(null)
  const [selectedCitizenship, setSelectedCitizenship] = useState(null)
  const [selectedOccupation, setSelectedOccupation] = useState(null)

  function onSubmit(e){
    e.preventDefault()
    let formState = {}
    if (selectedSnapshot !== "Enter Date - Latest"){
      formState.snapshot = selectedSnapshot
    }

    if (selectedYear !== "Enter Date - Latest"){
      formState.year = selectedYear
    }
    
    if (selectedWikiProject !== "Wikimedia Project - Any"){
      formState.wikiProject = selectedWikiProject 
    }
    
    if (selectedCitizenship !== "Citizenship - Any"){
      formState.citizenship = selectedCitizenship
    }
    setFormState(formState)
    setFetchURL(formState)
  }

  function setFetchURL(formState){
    // let url = `http://localhost:5000/v1/gender/gap/${formState.snapshot ? formState.snapshot : "latest"}/${selectedWikipediaHumanType}/properties?`
    // let url = `https://humaniki-staging.wmflabs.org/api/v1/gender/gap/${formState.snapshot ? formState.snapshot : "latest"}/${selectedWikipediaHumanType}/properties?`
    // let baseURL = "http://127.0.0.1:5000/v1/gender/gap/"

    let baseURL = process.env.REACT_APP_API_URL
    let url = `${baseURL}v1/gender/gap/${formState.snapshot ? formState.snapshot : "latest"}/${selectedWikipediaHumanType}/properties?`
    if (formState.year) {
      url = url + `&date_of_birth=${formState.year}`
    }

    if (formState.wikiProject) {
      url = url + `&project=${formState.wikiProject}`
    }

    if (formState.citizenship) {
      url = url + `&citizenship=${formState.citizenship}`
    }
    
    if (formState.year || formState.wikiProject || formState.citizenship) {
      url = url + "&label_lang=en"
    }
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
    return cell.toFixed(3)
  }

  const columns = []
  function processFetchData(data){
    let tableArr = []
    //create columns
    columns.push({dataField: "index", text: "Index", sort: true})
    columns.push({dataField: "total", text: "Total", sort: true})
    columns.push({dataField: "gap", text: "Gap", sort: true, style: {
      width: '40px',
      overflow: 'visible'
    }})
    columns.push({dataField: "women", text: "women", sort:true})
    columns.push({dataField: "womenPercent", text: "Women Percent", sort:true, formatter: percentFormatter})
    columns.push({dataField: "men", text: "men", sort:true})
    columns.push({dataField: "menPercent", text: "men Percent", sort:true, formatter: percentFormatter})
    for (let genderId in data.meta.bias_labels) {
      if (genderId !== "6581072" && genderId !== "6581097") {
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
    }
    
    // configure data 
    data.metrics.forEach((obj, index) => {
      let tableObj = {}
      tableObj.key = index
      tableObj.index = Object.values(obj["item_label"]).join()
      tableObj.total = Object.values(obj.values).reduce((a, b) => a + b)
      tableObj.men = 0 
      tableObj.menPercent = 0 
      tableObj.women = 0 
      tableObj.womenPercent = 0
      Object.keys(obj.values).forEach(value => {
        let label = data.meta.bias_labels[value]
        tableObj[label] = obj["values"][value.toString()]
        tableObj[label + "Percent"] = obj["values"][value.toString()]/tableObj["total"]*100
      })
      let genderTotalsArr = []
      console.log("HELLO", tableObj)
      
      console.log("HERE",Object.values(data.meta.bias_labels).map(gender => gender + "Percent"))
      Object.values(data.meta.bias_labels).map(gender => gender + "Percent").map(g => genderTotalsArr.push(tableObj[g]))
      console.log("gender total arr", genderTotalsArr)
      tableObj.gap = <SingleBarChart genderTotals={genderTotalsArr} />
      tableArr.push(tableObj)
    })

    setTableColumns(columns)
    setTableData(tableArr)
  }

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => processFetchData(data))
  }, [url])

  return (
    <div>
      <h1>Advanced Search</h1>

      <div className="human-div" >
        <h6>Different Wikipedia Categories of Humans</h6>
        <ToggleButtonGroup type="radio" name="human-type" defaultValue={"all"} onChange={handleHumanChange}>
          <ToggleButton value={"all"} name="all" size="lg" variant="outline-dark">All Humans on Wikidata</ToggleButton>
          <ToggleButton value={"at-least-one"} name="at-least-one" size="lg" variant="outline-dark">Humans With Atleast One Site Link</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="input-area">
        <AdvacnedSearchForm
          onSubmit={onSubmit}
          selectedSnapshot={selectedSnapshot}
          setSelectedSnapshot={setSelectedSnapshot}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedCitizenship={selectedCitizenship}
          setSelectedCitizenship={setSelectedCitizenship}
          selectedWikiProject={selectedWikiProject}
          setSelectedWikiProject={setSelectedWikiProject}
          selectedOccupation={selectedOccupation}
          setSelectedOccupation={setSelectedOccupation}
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
      
    </div>
  )
}

export default AdvancedSearchView