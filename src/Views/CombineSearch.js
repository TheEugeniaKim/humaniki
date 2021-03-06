import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'
import SingleBarChart from '../Components/SingleBarChart'
import AdvacnedSearchForm from '../Components/AdvancedSearchForm'
import { createColumns, percentFormatter, populations, QIDs, loadingDiv, keyFields } from '../utils'
import PopulationToggle from "../Components/PopulationToggler";
import GenderTable from '../Components/GenderTable'
import ErrorDiv from '../Components/ErrorDiv'

function CombineSearch({API, snapshots}){
  const [allMetrics, setAllMetrics] = useState(null)
  const [allMeta, setAllMeta] = useState(null)
  const [population, setPopulation] = useState(populations.GTE_ONE_SITELINK)
  const [tableColumns, setTableColumns] = useState([{}])
  const [tableArr, setTableArr] = useState([])
  const [tableMetaData, setTableMetaData] = useState({})
  const [snapshot, setSnapshot] = useState("latest")
  const [selectedCountries, setSelectedCountries] = useState(null)
  const [url, setURL] = useState(null)
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
    setIsLoading(true)
    setIsErrored(false)
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
    if (formState.selectedCitizenship){
      tempPropertyObj["property_obj"]["citizenship"] = formState.selectedCitizenship
    } 
    if (formState.selectedWikiProject){
      tempPropertyObj["property_obj"]["project"] = formState.selectedWikiProject
    }
    if (formState.selectedYearRange){
      if (formState.selectedYearRange === "all"){
        tempPropertyObj["property_obj"]["date_of_birth"] = formState.selectedYearRange
      } else if (formState.selectedYearRange === "startEnd") {
        let startDate = formState.selectedYearRangeStart ? formState.selectedYearRangeStart : ""
        let endDate = formState.selectedYearRangeEnd ? formState.selectedYearRangeEnd : ""
        tempPropertyObj["property_obj"]["date_of_birth"] = `${startDate}~${endDate}`
      }
    }
    if (Object.keys(tempPropertyObj["property_obj"]).length === 0){
      tempPropertyObj["property_obj"] = null
    }
    setFetchObj(tempPropertyObj)
    setURL(API.makeURLFromDataPath(tempPropertyObj))
  }

  function handleHumanChange(event){
    setIsLoading(true) 
    setPopulation(event)
  }

  function processTableData(meta, metrics){
    let tableArr = []

    metrics.forEach((obj, index) => {
      // Handle Formatting Table Data 
      let tableObj = {}
      tableObj.key = index 
      // delete citizenship abreviation 
      delete obj["item_label"]["iso_3166"]
      let item_labels = Object.values(obj["item_label"])
      item_labels = item_labels.length > 0 ? item_labels : ["Overall"]
      // in multi-dimensions search join the different titles in one index column
      if (item_labels.length > 1){
        tableObj.index = item_labels.join(", ")
      } else {
        // we know it's a single dimensional search
        // isNan(parseInt(value)) ? value : parseInt(value) 
        const value = item_labels[0]
        const valueAsNum = parseInt(value)
        tableObj.index = isNaN(valueAsNum) ? value : valueAsNum
      }
      // sometimes there is data but null values in item label. 
      //The table is looking for dataField=index so we need to set index null for items with no item labels
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
      setIsErrored(err)
    } else {
      if (!fetchData) return
      if (!snapshots) return
      setAllMetrics(fetchData.metrics)
      setAllMeta(fetchData.meta)
      // check if we get data (metrics) back
      // in the case where we query for metric but get 0 results 
      if (fetchData.metrics.length > 0){
        setTableColumns(createColumns(fetchData.meta, fetchData.metrics, keyFields.search, true))
        processTableData(fetchData.meta, fetchData.metrics)
      } else {
        setIsErrored({"API reachable but" : ["Query returned 0 results"]})
      }
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
      return
    }
    API.get(fetchObj, processAPIData)
  }, [population, snapshots, snapshot, fetchObj])

  const defaultSorted = [{
    dataField: 'index',
    order: 'asc'
  }];

  return(
    <div className="viz-container combine-view">
      <h2>Explore multiple data categories</h2>
      <PopulationToggle handleToggle={handleHumanChange}/>
      <div className="viz-description">
        <h4>Explore Search</h4>
        <p>
          The explore search shows cumulative gender metrics for different
          data categories at a time. </p>
        <div className="combine-search-note">
          Note: Select 2 filter dimensions at a time.
        </div>
      </div>
      <div className="explore-filter">
        <AdvacnedSearchForm
          onSubmit={onSubmit}
          snapshots={snapshots}
        />
      </div>
      <div className ="api-data-btn">
        {url ? <Button variant="secondary" href={url} target="_blank">API Link</Button> : null}
      </div>
      <div className="table-container">
        {isLoading ? loadingDiv : null }
        {isErrored ? <ErrorDiv errors={isErrored} /> : null }

        {
          // render the GenderTable when either isLoading or isErrored is false
          (isLoading || isErrored) ? 
            null :
            <GenderTable 
              tableArr={tableArr} 
              tableColumns={tableColumns} 
              keyField={keyFields.search}
              defaultSorted={defaultSorted}
            />
        }
      </div>

    </div>
  )
}

export default CombineSearch