import React, {useState, useEffect} from 'react'
import { InputGroup, FormControl, Form, Container, Col, Row} from 'react-bootstrap'
import PopulationToggle from '../Components/PopulationToggler'
import LineChart from '../Components/LineChart'
import {formatDate, populations} from '../utils'

import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { filterMetrics, createColumns } from "../utils";
import { toast } from 'react-toastify';

function GenderByDOBView({API, snapshots}) {
    const currYear = new Date().getFullYear()
    let makeYearFilterFn = (yearStart, yearEnd) => (metric) => {
        // this is a higher order function that will be predicate of each individual metric
        // is metric.item
        const metricYear = parseInt(metric.item.date_of_birth)
        // console.log("in make year filter fun", yearStart, metricYear, yearEnd)
        return yearStart <= metricYear && metricYear <= yearEnd
    }  
    const [allMetrics, setAllMetrics] = useState(null)
    const [allMeta, setAllMeta] = useState(null)
    const [genderMap, setGenderMap] = useState({})
    const [lineData, setLineData] = useState([])
    const [tableMetaData, setTableMetaData] = useState({})
    const [tableColumns, setTableColumns] = useState([])
    const [tableArr, setTableArr] = useState([])
    const [graphGenders, setGraphGenders] = useState({})
    const [yearStart, setYearStart] = useState(1600)
    const [yearEnd, setYearEnd] = useState(currYear)
    const [snapshot, setSnapshot] = useState(null)
    const [population, setPopulation] = useState(populations.GTE_ONE_SITELINK)
    const [isLoading, setIsLoading] = useState(true)
    const [isErrored, setIsErrored] = useState(false)


    function afterFilter(newResult, newFilters) {
        console.log(newResult);
        console.log(newFilters);
    }

    function handleChange(e) {
        console.log("Handle Change", e)
        if (!lineData){

        }
    }

    function handleHumanChange(e) {
        console.log('Handle Population Change,', e)
        setIsLoading(true)
        setPopulation(e)
    }

    function handleSnapshotChange(e) {
        setSnapshot(e.target.value)
    }

    function handleYearStart(e) {
        const year = parseInt(e.target.value)
        if (isNaN(year)){
          toast("Please Enter Numeric Year")
          setYearStart(1600)
        } else {
          setYearStart(year)
        }
    }

    function handleYearEnd(e) {
      const year = parseInt(e.target.value)
      if (isNaN(year)){
        toast("Please Enter Numeric Year")
        setYearEnd(currYear)
      } else {
        setYearEnd(year)
      }
    }

    function formatYear(num) {
        if (num > 0) {
            return num.toString() + " CE"
        } else {
            return (num * (-1)).toString() + " BCE"
        }
    }

    function createLineData(meta, metrics) {
        const lineData = []
        //line data loop
        for (let genderId in meta.bias_labels) {
            let genderLine = {}
            genderLine.name = genderId
            genderLine.values = []
            metrics.forEach(dp => {
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
        return lineData
    }

    function createTableArr(meta, metrics) {
        const tableArr = []
        const extrema = {
            percentMax: Number.NEGATIVE_INFINITY,
            percentMin: Number.POSITIVE_INFINITY,
            totalMax: Number.NEGATIVE_INFINITY,
            totalMin: Number.POSITIVE_INFINITY
        }
        metrics.forEach((dp, index) => {
            let tableObj = {}
            tableObj.key = index
            tableObj.sortValue = parseInt(dp.item_label.date_of_birth)
            tableObj.year = formatYear(parseInt(dp.item_label.date_of_birth))
            tableObj.total = Object.values(dp.values).reduce((a, b) => a + b)
            tableObj.sumOtherGenders = 0
            for (let genderId in meta.bias_labels) {
                let label = meta.bias_labels[genderId]
                tableObj[label] = dp["values"][genderId] ? dp["values"][genderId] : 0
                tableObj[label + "Percent"] = dp["values"][genderId] ? (dp["values"][genderId]/tableObj["total"])*100 : 0
                console.log("other genders arr", Object.keys(meta.bias_labels).filter(id => id!=="6581097" && id!=="6581072"))
                if (genderId !=="6581097" && genderId !=="6581072"){
                    tableObj.sumOtherGenders += dp["values"][genderId] ? dp["values"][genderId] : 0
                }
            }
            tableObj.sumOtherGendersPercent = (tableObj.sumOtherGenders/tableObj.total)*100
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
            // console.log("Table Obj", tableObj)
        })
        return [tableArr, extrema]
    }

    function filterAndCreateVizAndTable(meta, metrics) {
        const yearFilterFn = makeYearFilterFn(yearStart, yearEnd)
        // const filteredMetrics = metrics // TODO: actually filter metrics
        console.log("Length of prefilter input is ,", metrics.length)
        const filteredMetrics = filterMetrics(metrics, yearFilterFn)
        console.log("Length of postfilter input is ,", filteredMetrics.length)
        // Here is genderFilter metrics 
        // make fn in utils that will filter metrics by gender
        // const genderFilterMetricsApplied = 
        // const genderFilterMetrics = genderFilterMetrics()

        let tableArr, extrema
        [tableArr, extrema] = createTableArr(meta, filteredMetrics)
        setTableArr(tableArr)
        setTableMetaData(extrema)
        setGenderMap(meta.bias_labels)
        setGraphGenders(Object.values(meta.bias_labels))
        setLineData(createLineData(meta, filteredMetrics))
        setTableColumns(createColumns(meta, filteredMetrics, "year"))
    }

    function processData(err, data) {
        if (err) {
            setIsErrored(true)
            console.error("Error is", err)
        } else {
            console.log("DATA METRICS", data.metrics)
            setAllMetrics(data.metrics)
            setAllMeta(data.meta)
            filterAndCreateVizAndTable(data.meta, data.metrics)
        }
        setIsLoading(false)
        return true
    }

    // refetch useeffect
    useEffect(() => {
        setIsLoading(true)
        API.get({
            bias: "gender",
            metric: "gap",
            snapshot: "latest",
            population: population,
            property_obj: {date_of_birth: 'all', label_lang: "en"}
        }, processData)
    }, [snapshot, population])

    // refilter useeffect
    useEffect(() => {
        if (allMeta && allMetrics) {
            filterAndCreateVizAndTable(allMeta, allMetrics)
        }
    }, [yearStart, yearEnd])

    const errorDiv = <div>Error</div>
    const loadingDiv = <div>Loading</div>
    const snapshotsDropdownOptions = snapshots ? (
        <div>
            <Form.Label>Snapshot (YYYY-DD-MM)</Form.Label>
            <Form.Control
                as="select"
                onChange={handleSnapshotChange}
                value={snapshot ? snapshot :  "latest"}
                >
                {
                    snapshots.map((snapshot, index) => (
                        <option key={snapshot.id}>{index === 0 ?  formatDate(snapshot.date)+" (latest)" : formatDate(snapshot.date) }</option>
                    ))
                }
            </Form.Control>
        </div>
    ) : <div> snapshots loading </div>

    return (
        <Container className="view-container">
            <Row className="justify-content-md-center">
                <h1>Gender Gap By Year of Birth and Year of Death Statistics</h1>
                <h5>
                    This plot shows the Date of Birth (DoB) and Date of Death (DoD) of each biography in Wikidata,
                    by gender, non-binary gender, by last count there are 9 non-binary genders, are displayed in the tables,
                    and accounted for in the full data set
                </h5>
            </Row>

            <Row className="input-area">
                <div>
                    <p style={{border: "2px solid"}}>
                        Note: As for January, 2016, only about 72% and 36% of biographies had date
                        of birth and date of death, respectively, so this data is incomplete.
                    </p>
                </div>

                <h6>Different Wikipedia Categories of Humans</h6>
                <PopulationToggle handleToggle={handleHumanChange}/>

                {/* <h6>Gender Line Filter: </h6>
                <ToggleButtonGroup type="checkbox" name="gender-selection" defaultValue={["female", "male", "other-genders"]} onChange={handleChange}>
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
                        label="Other Genders"
                        name="other-genders"
                        value="other-genders"
                    />
                </ToggleButtonGroup> */}
                
                { snapshotsDropdownOptions }
            </Row>
            <Row className="justify-content-md-center">
                <Col lg={8}>
                    {
                        lineData.length === 0 ? null :
                        <LineChart
                            lineData={lineData}
                            graphGenders={graphGenders}
                            extrema={tableMetaData}
                            genderMap={genderMap}
                        />
                    }
                </Col>
                <Col sm={4}>
                    <InputGroup className="mb-3" size="sm">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Year Range:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl type="text" placeholder={yearStart} onChange={handleYearStart}/>
                        <FormControl type="text" placeholder={yearEnd} onChange={handleYearEnd}/>
                    </InputGroup>
                </Col>
            </Row>

            <Row className="table-container">
                {isLoading ? loadingDiv : null}
                {isErrored ? errorDiv : null}
                {
                    tableColumns.length === 0 ? null :
                        <BootstrapTable
                            keyField='key'
                            data={tableArr}
                            columns={tableColumns}
                            filter={filterFactory({afterFilter})}
                            pagination={paginationFactory()}
                            className={".table-striped"}
                        />
                }
            </Row>
        </Container>
    )
}

export default GenderByDOBView