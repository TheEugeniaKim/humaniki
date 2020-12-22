import React, {useState, useEffect} from 'react'
import { ToggleButtonGroup, ToggleButton, InputGroup, FormControl, Form, Container } from 'react-bootstrap'
import LineChart from '../Components/LineChart'

import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'


function GenderByDOBView({getAPI}){
  const [genderMap,setGenderMap] = useState({})
  const [lineData, setLineData] = useState([])
  const [tableMetaData, setTableMetaData] = useState({})
  const [tableColumns, setTableColumns] = useState([])
  const [tableArr, setTableArr] = useState([])
  const [graphGenders, setGraphGenders] = useState({})
  const [yearFilterRange, setYearFilterRange] = useState({yearStart: "Enter Year Start", yearEnd: "Enter Year End"})
  const [snapshot, setSnapshot] = useState("latest")
  const [population, setPopulation] = useState("all_wikidata")
  const [isLoading, setIsLoading] = useState(true)
  const [isErrored, setIsErrored] = useState(false)

  function afterFilter(newResult, newFilters) {
    console.log(newResult);
    console.log(newFilters);
  }
  
  function handleChange() {
    console.log("Handle Change")
  }

  function handleHumanChange(e) {
    console.log(e)
    console.log("HANDLE HUMAN CHANGE")
    setPopulation(e)
  }

  function handleSnapshot(e){
    setSnapshot(e.target.value)
  }

  function handleYearStart(e){
    console.log(e.target.value)
  }

  function handleYearEnd(e){
    console.log(e.target.value)

  }
  
  function formatYear(num){
    if (num > 0) {
      return num.toString() + " CE"
    } else {
      return (num * (-1)).toString() + " BCE"
    }
  }

  function processData(err, data){
    if (err){
      setIsErrored(true)
    } else {

      const tableArr = []
      const columns = []
      const lineData = []
      const graphLabels = Object.values(data.meta.bias_labels)
      const genderMap = setGenderMap(data.meta.bias_labels)
      const extrema = {
        percentMax: Number.NEGATIVE_INFINITY,
        percentMin: Number.POSITIVE_INFINITY,
        totalMax: Number.NEGATIVE_INFINITY,
        totalMin: Number.POSITIVE_INFINITY
      }
      columns.push({
        dataField: "year", 
        text: "Year", 
        filter: textFilter(), 
        headerStyle: {"minWidth": "200px", "width": "20%"}, 
        sort: true, 
        // sortFunc: (sortValue) => {a.sortValue - b.sortValue}
      })
      columns.push({dataField: "total",text: "Total",sort: true})
      // loop over genders and create formatted column array
      for (let genderId in data.meta.bias_labels) {
        let obj = {
          dataField: data.meta.bias_labels[genderId],
          text: data.meta.bias_labels[genderId],
          sort: true
        }
        let objPercent = {
          dataField: data.meta.bias_labels[genderId] + "Percent",
          text: data.meta.bias_labels[genderId] + " Percent",
          sort: true
        }
        obj.label = data.meta.bias_labels[genderId]
        columns.push(obj)
        columns.push(objPercent)
      }

      //line data loop
      for (let genderId in data.meta.bias_labels) {
        let genderLine = {}
        genderLine.name = genderId
        genderLine.values = []
        data.metrics.forEach(dp => {
          if (Object.keys(dp.values).includes(genderId)) {
            let tupleObj = {
              year: +dp.item_label.date_of_birth,
              value: dp["values"][genderId]
            }
            genderLine.values.push(tupleObj)
          }
        })
        lineData.push(genderLine)
      }

      //table loop
      data.metrics.forEach((dp, index) => {
        let tableObj = {}
        tableObj.key = index
        tableObj.sortValue = parseInt(dp.item_label.date_of_birth)
        tableObj.year = formatYear(parseInt(dp.item_label.date_of_birth))
        tableObj.total = Object.values(dp.values).reduce((a,b) => a + b)
        for (let genderId in data.meta.bias_labels){
          let label = data.meta.bias_labels[genderId]
          tableObj[label] = dp["values"][genderId] ? dp["values"][genderId] : 0 
          tableObj[label + "Percent"] = dp["values"][genderId] ? (dp["values"][genderId]/tableObj["total"])*100 : 0  
        }
        tableArr.push(tableObj)
        if (tableObj.womenPercent > extrema.percentMax) {
          extrema.percentMax = tableObj.womenPercent
        } else if (tableObj.womenPercent < extrema.percentMin) {
          extrema.percentMin = tableObj.womenPercent
        }

        if (tableObj.total > extrema.totalMax) {
          extrema.totalMax = tableObj.total
        } else if (tableObj.total < extrema.totalMin) {
          extrema.totalMin = tableObj.total
        }
        console.log("Table Obj", tableObj)
      })
      setGraphGenders(graphLabels)
      setTableMetaData(extrema)
      setLineData(lineData)
      setTableArr(tableArr)
      setTableColumns(columns)
    }
    setIsLoading(false)
    return true 
  }

  useEffect(() => {
    getAPI({
      bias: "gender", 
      metric: "gap", 
      snapshot: "latest", 
      population: "gte_one_sitelink", 
      property_obj: {date_of_birth: "all", label_lang: "en"}
    }, processData)
  }, [snapshot, population])

  const errorDiv = <div>Error</div>
  const loadingDiv = <div>Loading</div>
  return (
    <Container className="view-container">
       <h1>Gender Gap By Year of Birth and Year of Death Statistics</h1>
       <h5>
         This plot shows the Date of Birth (DoB) and Date of Death (DoD) of each biography in Wikidata, 
         by gender, non-binary gender, by last count there are 9 non-binary genders, are displayed in the tables, 
         and accounted for in the full data set 
       </h5>

       <Container className="input-area">
         <div>
          <p style={{border: "2px solid"}}>
            Note: As for January, 2016, only about 72% and 36% of biographies had date
            of birth and date of death, respectively, so this data is incomplete.
          </p>
         </div>
          
         <h6>Different Wikipedia Categories of Humans</h6>
           <ToggleButtonGroup type="radio" name="human-type" defaultValue={"all"} onChange={handleHumanChange}>
              <ToggleButton value={"all_wikiData"} name="all" size="lg" variant="outline-dark">All Humans on Wikidata</ToggleButton>
              <ToggleButton value={"gte_one_sitelink"} name="at-least-one" size="lg" variant="outline-dark">Humans With At Least One Wikipedia Article</ToggleButton>
           </ToggleButtonGroup>
        
         <div>
           <ToggleButtonGroup type="radio" name="data-selection" defaultValue={"dob"} onChange={handleChange}> 
             <Form.Check
              type="radio"
              label="Gender by Date of Birth"
              name="gender-by-dob"
              value="gender-by-dob"
            />
            <Form.Check
              type="radio"
              label="Gender by Date of Death"
              name="gender-by-dod"
              value="gender-by-dod"
            />
          </ToggleButtonGroup>
          <ToggleButtonGroup type="checkbox" name="gender-selection" defaultValue={"female"} onChange={handleChange}>
            <Form.Check
              type="checkbox"
              label="Male"
              name="male"
              value="male"
            />
            <Form.Check
              type="checkbox"
              label="Female"
              name="female"
              value="female"
            />
            <Form.Check
              type="checkbox"
              label="Non Binary"
              name="non-binary"
              value="non-binary"
            />
          </ToggleButtonGroup>
          <InputGroup className="mb-3" size="sm" >
            <InputGroup.Prepend>
              <InputGroup.Text>Year Range:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl type="text" placeholder={yearFilterRange.yearStart} onChange={handleYearStart} />
            <FormControl type="text" placeholder="Year End" onChange={handleYearEnd} />
          </InputGroup>
          <InputGroup className="mb-3" size="sm" >
            <InputGroup.Prepend>
              <InputGroup.Text>Snapshot:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl type="text" placeholder={snapshot} onChange={handleSnapshot} />
          </InputGroup>
        </div>
      </Container>      
        {
          lineData.length === 0 ? null : 
          <LineChart 
          lineData={lineData} 
          graphGenders={graphGenders}
          extrema={tableMetaData} 
          genderMap={genderMap}
        />}

      <div className="table-container">
        {isLoading ? loadingDiv : null }
        {isErrored ? errorDiv : null }
        {
          tableColumns.length === 0 ? null :
          <BootstrapTable 
            keyField='key' 
            data={ tableArr } 
            columns={ tableColumns } 
            filter={ filterFactory({ afterFilter }) } 
            pagination={ paginationFactory() }
            className={".table-striped"}
          />
        }
      </div>
    </Container>
  )
}

export default GenderByDOBView