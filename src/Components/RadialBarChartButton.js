import React, { useRef, useEffect, useState } from "react";
import "../App.css";
import "../Sk.css";
import * as d3 from 'd3'

function RadialBarChart(props){
  const ref = useRef(null)
  const createPie = d3
    .pie()
    .value(data => data.value)
    .sort(null)
  const createArc = d3
    .arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius)
  const colors = d3.scaleOrdinal(["#00BCA1","#BC8F00","#6200F8"])
  const format = d3.format(".2F")
 
  useEffect(() => {
    const data = createPie(props.data)
    const percentWomen = props.data.filter(obj => obj.label === "women")[0].value
    const group = d3.select(ref.current)
    const groupWithData = group.selectAll("g.arc").data(data)

    groupWithData.exit().remove()

    const groupWithUpdate = groupWithData
      .enter()
      .append("g")
      .attr("class", "arc")
    
    const path = groupWithUpdate
      .append("path")
      .merge(groupWithData.select("path.arc"))
    
    path  
      .attr("class", "arc")
      .attr("d", createArc)
      .attr("fill", (d,i) => colors(i))
    
    const text = groupWithUpdate
      .append("text")
      .merge(groupWithData.select("text"));
    text
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("fill", "black")
      .style("font-size", 8)
      .text(d => `${percentWomen}% Women`)
  })

  return (
    <div>
      <svg className="button-svg" width={props.width} height={props.height}>
        <g 
          ref={ref}
          transform={`translate(${props.outerRadius} ${props.outerRadius})`}
        />
      </svg>
    </div>
  )
}

export default RadialBarChart;