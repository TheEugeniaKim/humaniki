import React, { useEffect, useState, useRef } from 'react'
import { select, scaleBand } from 'd3'

function SingleBarChart(props){
  const svgRef = useRef()

  useEffect(() => {
    if (!props.genderTotals){return}
    const svg = select(svgRef.current)

    const colors = ["#BC8F00","#6200F8","#00BCA1"]

    const xScale = scaleBand()
    .domain([0,100])
    .range([0, 100])
    // .padding(0.5)
    let percentSoFar = 0 
    let genderTotalArr = []
    props.genderTotals.forEach(percent => {
      genderTotalArr.push({percent: percent, percentSoFar: percentSoFar})
      percentSoFar+=percent 
    })
    svg.selectAll("rect")
    .data(genderTotalArr)
    .join("rect")
    .attr("fill", function(d, i) {return colors[i]; })
    .attr("width", (value) => value.percent + "%")
    .attr("height", "30%")
    .attr("x", (value) => value.percentSoFar + "%")    
  }, [props.genderTotals])

  return (
    <svg ref={svgRef}></svg>
  )
}

export default SingleBarChart