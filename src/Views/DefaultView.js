import React, { useState, useEffect, useRef } from 'react'
import { select } from 'd3'
import { Container, Row } from 'react-bootstrap'
import SingleBarChart from '../Components/SingleBarChart'
import "../App.css"
import "../Sk.css"
import { colors } from '../utils'
import scatterplotLogo from "../assets/scatterplotButton.png"

function DefaultView({API}){
  const svgRef = useRef()
  const [totalMen, setTotalMen] = useState()
  const [totalWomen, setTotalWomen] = useState()
  const [totalOthers, setTotalOthers] = useState()
  const [total, setTotal] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isErrored, setIsErrored] = useState(false)


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
      <h4> Recent Distribution of Articles </h4>
        <h3> {totalMen} Male Biographies </h3>
        <h3> {totalOthers} Σ Other Biographies </h3>
        <h3> {totalWomen} Female Biographies </h3>
      <SingleBarChart genderTotals={[
        (totalMen/total*100), 
        (totalOthers/total*100), 
        (totalWomen/total*100)
      ]} />
    </div>

  return (
    <Container className="default">
      <Row className="default-content">
        <h4 className="default-title">Humaniki provides statistics about the gender gap in the content of all Wikimedia projects</h4>
        <h6>
          For example, as of August 2020, only 17% of content in all Wikimedia projects including biographies on Wikipedia are about women.
        </h6>
      </Row>
      {isLoading ? loadingDiv : null }
      {isErrored ? errorDiv : null }
      {!isLoading && !isErrored ? viz : null }
      <img className="nav-logo" src={scatterplotLogo} alt="humaniki-logo"/>
    </Container>
  )
}

export default DefaultView