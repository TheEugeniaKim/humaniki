import React, { useState, useEffect, useRef } from 'react'
import { select} from 'd3'
import { Container, Row } from 'react-bootstrap'
import "../App.css"
import "../Sk.css"

function DefaultView({getAPI}){
  const processCB = (err, jsonData) => {
    if (err) {alert('process CB got an error')}
    else {alert("process CB success", jsonData['meta'])}
  }

  let APIRes = getAPI({bias: "gender", metric: "gap", snapshot: "latest", population:"gte_one_sitelink", property_obj:null},
                      processCB)

  const svgRef = useRef()
  const [totalMen, setTotalMen] = useState()
  const [totalWomen, setTotalWomen] = useState()
  const [totalOthers, setTotalOthers] = useState()

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
    .attr("height", "100%")
    .attr("x", (value) => value)    
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
      <div className="default-data-container">
        <h4> Recent Distribution of Articles </h4>
        <h3> {totalMen} Male Biographies </h3>
        <h3> {totalOthers} Σ Other Biographies </h3>
        <h3> {totalWomen} Female Biographies </h3>
        <svg className="default-svg" ref={svgRef}></svg>
      </div>
      
      <Row className="About-Explainer">
        Expore further dynames of the gender gap in bibliographic content on Wikipedia
        with Humaniki and learn how you can contribute to bridge this gap. Compare gender 
        diversity across Wikipedia language editions, gender by country, and date of birth. 
      </Row>
    </Container>
  )
}

export default DefaultView