import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'
import SingleBarChart from '../Components/SingleBarChart'
import AdvacnedSearchForm from '../Components/AdvancedSearchForm'
import {percentFormatter, populations, QIDs, errorDiv, loadingDiv } from '../utils'
import PopulationToggle from "../Components/PopulationToggler";
import GenderTable from '../Components/GenderTable'

function CombineSearch({API, snapshots}){
  const [allMetrics, setAllMetrics] = useState(null)
  const [allMeta, setAllMeta] = useState(null)
  const [population, setPopulation] = useState(populations.GTE_ONE_SITELINK)
  const [tableColumns, setTableColumns] = useState([{dataField: "index", text: "Index", sort: true}])
  const [tableArr, setTableArr] = useState([])
  const [tableMetaData, setTableMetaData] = useState({})

  const [snapshot, setSnapshot] = useState("latest")
  const [selectedCountries, setSelectedCountries] = useState(null)
  const [fetchObj, setFetchObj] = useState({
    bias: "gender",
    metric: "gap",
    snapshot: snapshot,
    population: population,
    property_obj: {
      label_lang: "en"
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isErrored, setIsErrored] = useState(false)

  const onSubmit = (formState) => {
    let tempPropertyObj = {
      bias: "gender",
      metric: "gap",
      snapshot: snapshot,
      population: population,
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
    setIsLoading(true) 
    setPopulation(event)
  }

  function processColumnData(meta, metrics){
    let columns = []
    console.log("columns", meta, metrics)
    columns.push({dataField: "index", text: "Index".toUpperCase(), filter: textFilter(), headerStyle: {"minWidth": "200px", "width": "20%"}})
    columns.push({dataField: "total",text: "Total", sort: true})
    columns.push({dataField: "gap", text: "Gap", sort: true, headerStyle: {
      "overflow": 'visible',
      "minWidth": "200px", 
      "width": "20%"
    }})
    columns.push(
      {
        dataField: meta.bias_labels[QIDs.female],
        text: meta.bias_labels[QIDs.female],
        sort: true,
        classes: "gender-col gender-col-female"
      }
    )
    columns.push(
      {
        dataField: meta.bias_labels[QIDs.female] + "Percent",
        text: meta.bias_labels[QIDs.female] + " Percent",
        sort: true,
        formatter: percentFormatter,
        classes: "gender-col gender-col-percent-female"
      }
    )
    columns.push(
      {
        dataField: meta.bias_labels[QIDs.male],
        text: meta.bias_labels[QIDs.male],
        sort: true,
        classes: "gender-col gender-col-male"
      }
    )
    columns.push(
      {
        dataField: meta.bias_labels[QIDs.male] + "Percent",
        text: meta.bias_labels[QIDs.male] + " Percent",
        sort: true,
        formatter: percentFormatter,
        classes: "gender-col gender-col-percent-male"
      }
    )
    columns.push({dataField: "sumOtherGenders", text: "∑ Other Genders", sort: true, classes: "gender-col gender-col-sum-other" })
    columns.push({dataField: "sumOtherGendersPercent", text: "∑ Other Genders Percent", sort: true, formatter: percentFormatter, classes: "gender-col gender-col-percent-sum-other"})
    for (let genderId in meta.bias_labels) {
      if (genderId !==QIDs.female && genderId !==QIDs.male){
        // check if bias label exists else use QID
        let biasLabel = meta.bias_labels[genderId] ? meta.bias_labels[genderId] : genderId
        let obj = {

          dataField: biasLabel ,
          text: biasLabel,
          label: biasLabel,
          sort: true,
          hidden: true
        }
        let objPercent = {
          dataField: biasLabel + "Percent",
          text: biasLabel + " Percent",
          label: biasLabel + " Percent",
          sort: true,
          formatter: percentFormatter,
          hidden: true
        }
        columns.push(obj)
        columns.push(objPercent)
      }
    }
    setTableColumns(columns)
  }

  function processTableData(meta, metrics){
    console.log("INSIDE PROCESS TABLE DATA")
    let tableArr = []
    let genders = Object.values(meta.bias_labels).map(gender => {
      return {
        value: gender, 
        label: gender
      }
    })

    metrics.forEach((obj, index) => {
      // Handle Formatting Table Data 
      let tableObj = {}
      tableObj.key = index 
      let item_labels = Object.values(obj["item_label"])
      item_labels = item_labels.length > 0 ? item_labels : ["Overall"]
      tableObj.index = item_labels.length > 1 ? item_labels.join(", ") : item_labels[0]
      if (item_labels.includes(null)){
        tableObj.index = null
      }
      tableObj.total = Object.values(obj.values).reduce((a,b) => a + b)
      tableObj.sumOtherGenders = 0
      for (let genderId in meta.bias_labels) {
        let label = meta.bias_labels[genderId] ? meta.bias_labels[genderId] : genderId
        tableObj[label] = obj["values"][genderId] ? obj["values"][genderId] : 0 
        tableObj[label + "Percent"] = obj["values"][genderId] ? (obj["values"][genderId]/tableObj["total"])*100 : 0
        if (genderId !=="6581097" && genderId !=="6581072"){
          tableObj.sumOtherGenders += obj["values"][genderId] ? obj["values"][genderId] : 0
        }
      }
      tableObj.sumOtherGendersPercent = (tableObj.sumOtherGenders/tableObj.total)*100
      let genderTotalsArr = []
      genderTotalsArr.push(tableObj.femalePercent)
      genderTotalsArr.push(tableObj.malePercent)
      genderTotalsArr.push(tableObj.sumOtherGendersPercent)
      tableObj.gap = <SingleBarChart genderTotals={genderTotalsArr} />
      if (tableObj.index){
        tableArr.push(tableObj)
      }
    })
    setTableArr(tableArr)
  }

  function processAPIData(err, fetchData){
    if (err){
      console.log("ERROR:",err)
      setIsErrored(true)
    } else {
      if (!fetchData) return
      if (!snapshots) return
      console.log("resData:", fetchData, "snapshotData:", snapshots)
      setAllMetrics(fetchData.metrics)
      setAllMeta(fetchData.meta)
      processColumnData(fetchData.meta, fetchData.metrics)
      processTableData(fetchData.meta, fetchData.metrics)
      // let multiSelectData = createMultiSelectData(fetchData.metrics)
      // setAllCountries(multiSelectData)
      // filterAndCreateVizAndTable(fetchData.meta, fetchData.metrics)
    }
    setIsLoading(false)
    return true 
  }

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }

  useEffect(() => {
    if (!snapshots){
      console.log("INUSEEFFECT ERR")
      return
    }
    API.get(fetchObj, processAPIData)
  }, [population, snapshots, snapshot, fetchObj])

  console.log("pop", population)
  return(
    <Container className="view-container">
      <h2>Explore multiple data categories</h2>
      <PopulationToggle handleToggle={handleHumanChange}/>
      <h4>Explore Search</h4>
      <p>
        The explore search shows cumulative gender metrics for different
        data categories at a time. 

        Note: Select 2 filter dimensions at a time.
      </p>

      <AdvacnedSearchForm
        onSubmit={onSubmit}
        snapshots={snapshots}
      /> 
      <div className="table-container">
        {isLoading ? loadingDiv : null }
        {isErrored ? errorDiv : null }

        <GenderTable 
          tableArr={tableArr} 
          tableColumns={tableColumns} 
        />
      </div>

    </Container>
  )
}

export default CombineSearch