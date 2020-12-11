import React, { useState, useEffect, useRef } from 'react'
import { select, scaleLinear} from 'd3'
import { Container, Col, Row } from 'react-bootstrap'
import "../App.css"
import "../Sk.css"

function DefaultView(){
  const svgRef = useRef()
  const [totalMen, setTotalMen] = useState(800)
  const [totalWomen, setTotalWomen] = useState(183)
  const [totalOthers, setTotalOthers] = useState(1)
  //when we load real data or dummy data set the variables in the useEffect
  
  function calculatePercentageGap(totalMen, totalOthers, totalWomen) {
    const total = totalMen + totalOthers + totalWomen
    const percentTotalMen = totalMen/total * 100 
    const percentTotalOthers = totalOthers/total * 100 
    const percentTotalWomen = totalWomen/total * 100 
    return [percentTotalMen, percentTotalOthers, percentTotalWomen]
  }

  function processFetchData(data){
    let totalMen = data.metrics[0].values["6581097"]
    let totalWomen = data.metrics[0].values["6581072"]
    let totalOthers = data.metrics[0].values
    totalOthers["6581097"] = 0
    totalOthers["6581072"] = 0
    totalOthers = Object.values(totalOthers).reduce((a,b) => a+b)
    setTotalMen(totalMen)
    setTotalWomen(totalWomen)
    setTotalOthers(totalOthers)
  }

  useEffect(() => {
    const svg = select(svgRef.current)
    const colors = ["#BC8F00","#6200F8","#00BCA1"]
    let baseURL = process.env.REACT_APP_API_URL
    let url = `${baseURL}v1/gender/gap/latest/gte_one_sitelink/properties?&label_lang=en`
    fetch(url)
    .then(response => response.json())
    .then(data => processFetchData(data))

    svg.selectAll("rect")
    .data([totalMen, totalOthers, totalWomen])
    .join("rect")
    .attr("fill", function(d, i) {return colors[i]; })
    .attr("width", "100%")
    .attr("height", "300px")
    .attr("x", (value) => value)    
    .attr("y", "100px")
  }, [totalMen, totalOthers, totalWomen])

  return (
    <Container className="default">
      <Row className="default-content">
        <h3 className="default-title">Explore Gender Diversity on Wikipedia Biographies with humaniki </h3>
        <h5>
          Humaniki is a project producing a open data set about the gender, 
          date of birth, place of birth, occupation, and language of biography articles 
          in all Wikipedias.
        </h5>
      </Row>
      <Row className="default-data-container">
        <h4>Recent Distribution of Articles</h4>
        <h3>{totalMen} Male Biographies</h3>
        <h3>{totalOthers} Σ Other Biographies</h3>
        <h3>{totalWomen} Female Biographies</h3>
        <svg className="default-svg" ref={svgRef}></svg>
      </Row>
      
      <Row className="About-Explainer">
        Expore further dynames of the gender gap in bibliographic content on Wikipedia
        with Humaniki and learn how you can contribute to bridge this gap. Compare gender 
        diversity across Wikipedia language editions, gender by country, and date of birth. 
      </Row>
    </Container>
  )
}

export default DefaultView