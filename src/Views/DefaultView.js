import React, { useState, useEffect, useRef } from 'react'
import { select } from 'd3'
import { Container, Row } from 'react-bootstrap'
import SingleBarChart from '../Components/SingleBarChart'
import "../App.css"
import "../Sk.css"
import { colors } from '../utils'
import scatterplotLogo from "../assets/scatterplotButton.png"
import timeseriesLogo from "../assets/timeseriesButton.png"
import worldmapLogo from "../assets/worldmapButton.png"
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import NumericLabel from 'react-pretty-numbers';


function DefaultView({API}){
  const svgRef = useRef()
  const [totalMen, setTotalMen] = useState()
  const [totalWomen, setTotalWomen] = useState()
  const [totalOthers, setTotalOthers] = useState()
  const [total, setTotal] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isErrored, setIsErrored] = useState(false)

  const prettyNumParams = {
    'shortFormat':true
  }

  function processFetchData(err, data){
    if (err) {
      console.log("err", err)
      setIsErrored(true)
    }
    else{
      console.log(data)
      setTotal(Object.values(data.metrics[0].values).reduce((a,b) => a+b))
      let totalMen = data.metrics[0].values["6581097"]
      let totalWomen = data.metrics[0].values["6581072"]
      let totalOthers = data.metrics[0].values
      totalOthers["6581097"] = 0
      totalOthers["6581072"] = 0
      totalOthers = Object.values(totalOthers).reduce((a,b) => a+b)
      console.log("LOOK HERE", total)
      setTotalMen(totalMen)
      setTotalWomen(totalWomen)
      setTotalOthers(totalOthers)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    console.log("ABOUT TO RUN  GET")
    API.get({
      bias: "gender", 
      metric: "gap", 
      snapshot: "latest", 
      population: "gte_one_sitelink", 
      property_obj: null
    }, processFetchData)

    const svg = select(svgRef.current)

    svg.selectAll("rect")
    .data([totalMen, totalOthers, totalWomen])
    .join("rect")
    .attr("fill", function(d, i) {return colors[i]; })
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("x", (value) => value)    
  }, [totalMen, totalOthers, totalWomen])

  const errorDiv = <div>Error</div>
  const loadingDiv = <div>Loading</div>
  const viz = 
    <div className="default-data-container">
      <h5> Global Gender Gap </h5>
      <h6> Distribution of content of humans in all Wikimedia Projects </h6>
      <div className="list-gender-gap">
        <div className = "col-male">
          <h4>
            <NumericLabel params={prettyNumParams}>
              {totalMen} 
            </NumericLabel>
          </h4>
          <h6> Male Biographies </h6>
        </div>
        <div className = "col-gender">
          <h4> 
            <NumericLabel params={prettyNumParams}>  
              {totalOthers} 
            </NumericLabel>
          </h4>
          <h6> Σ Other Biographies (sum) </h6>
        </div>
        <div className = "col-gender">
          <h4> 
            <NumericLabel params={prettyNumParams}>
              {totalWomen} 
            </NumericLabel>
          </h4>
          <h6> Female Biographies </h6>
        </div>
      </div>
      <SingleBarChart genderTotals={[
        (totalMen/total*100), 
        (totalOthers/total*100), 
        (totalWomen/total*100)
      ]} />
      <p>All time, as of LATEST SNAPSHOT DATE Month Year</p>
    </div>

  return (
    <div className="default-main">
      <div className="default">
        <Row className="default-content">
          <h4 className="default-title">Humaniki provides statistics about the gender gap in the content of all Wikimedia projects</h4>
          <h6>
            For example, as of LATEST SNAPSHOT Month Year, only LATEST TOTAL COVERAGE % of content in all Wikimedia projects including biographies on Wikipedia are about women.
          </h6>
        </Row>
        {isLoading ? loadingDiv : null }
        {isErrored ? errorDiv : null }
        {!isLoading && !isErrored ? viz : null }
      </div>
      <div className="visualization-collection">
        <h4> Visualization Collection </h4>
        <h6> Humaniki allows you to explore the gender gap by several dimensions: </h6>
        <div className="row-viz-button">
          <Link to = {`/gender-by-country`} className ="col-button-container">  
            <div className="col-button col-worldmap">
              <h5> Gender by Country </h5>
              <h7> What is the spatial distribution of gender data? </h7>
            </div>
          </Link>
          <Link to = {`/gender-by-language`} className ="col-button-container"> 
            <div className="col-button col-scatterplot">
              <h5> Gender by Wikimedia Project </h5>
              <h7> How do different language Wikimedia projects compare in terms of gender diversity?</h7>
            </div>
          </Link>
          <Link to = {`/gender-by-dob`} className ="col-button-container"> 
            <div className="col-button col-timeseries">
              <h5> Gender by Date of Birth and Death </h5>
              <h7> What is the temporal distribution of gender data? </h7>
            </div>
          </Link>
        </div>
      </div>
      <div className="combine-search">
        <h4> Combine Search </h4>
        <h6> How to view cumulative gender metrics for different data dimensions at a time? </h6>
        <div className="row-combinesearch">
          <div className="col-combinesearch combinesearch-text">
            <p>You can mix these three dimensions, for example to gather data about the biographies in the German Wikipedia about French people born in the 19th century.</p>
          </div>
          <div className="col-combinesearch combinesearch-button">
            <Button>
              <Link to = {`/combine-search`}> Combine Search </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefaultView