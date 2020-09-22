import React, { useState, useEffect, useRef } from 'react'
import { select, scaleLinear} from 'd3'
import "../App.css"

function AboutPage(){
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

  useEffect(() => {
    const svg = select(svgRef.current)

    const colors = ["#BC8F00","#6200F8","#00BCA1"]

    svg.selectAll("rect")
    .data([totalMen,totalOthers, totalWomen])
    .join("rect")
    .attr("fill", function(d, i) {return colors[i]; })
    .attr("width", "100%")
    .attr("height", "300px")
    .attr("x", (value) => value)    
    .attr("y", "100px")
  }, [totalMen, totalOthers, totalWomen])

  return (
    <div className="About">
      <div className="About-Content">
        <h1>Explore Gender Diversity on Wikipedia Biographies with humaniki </h1>
        <h3>
          Humaniki is a project producing a open data set about the gender, 
          date of birth, place of birth, occupation, and language of biography articles 
          in all Wikipedias.
        </h3>
      </div>
      
      <div className="About-DataContainer">
        <h4>Recent Distribution of Articles</h4>
        <h3>{totalMen} Male Biographies</h3>
        <h3>{totalWomen} Female Biographies</h3>

        <svg ref={svgRef}></svg>

      </div>
      
      <p>
        Expore further dynames of the gender gap in bibliographic content on Wikipedia
        with Humaniki and learn how you can contribute to bridge this gap. Compare gender 
        diversity across Wikipedia language editions, gender by country, and date of birth. 
      </p>
    </div>
  )
}

export default AboutPage 