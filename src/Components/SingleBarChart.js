import React, { useEffect, useState, useRef } from 'react'
import { select } from 'd3'

function SingleBarChart(props){
  const svgRef = useRef()
  

  useEffect(() => {
    console.log("RENDERING SINGLE BAR", props.genderTotals)
    if (!props.genderTotals){return}
    const svg = select(svgRef.current)

    const colors = ["#BC8F00","#6200F8","#00BCA1"]

    svg.selectAll("rect")
    .data(props.genderTotals)
    .join("rect")
    .attr("fill", function(d, i) {return colors[i]; })
    .attr("width", "100%")
    .attr("height", "30px")
    .attr("x", (value) => value)    
    .attr("y", "30px")
  }, [props.genderTotals])

  return (
    <svg ref={svgRef}></svg>
  )
}

export default SingleBarChart