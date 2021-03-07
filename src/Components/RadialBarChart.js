import React, { useRef, useEffect } from "react";
import "../App.css";
import "../Sk.css";
import { select, arc, pie, interpolate } from "d3";
import useResizeObserver from './useResizeObserver';

function RadialBarChart({data}){
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);

    if(!dimensions) return

    const arcGenerator = arc()
      .innerRadius(35)
      .outerRadius(45)
    const pieGenerator = pie()
    const instructions = pieGenerator(data)
    const completePercentDisplay = data[0]*100

    svg 
      .selectAll(".slice")
      .data(instructions)
      .join("path")
      .attr("class", "slice")
      .attr("stroke", "black")
      .attr("fill", (instruction, index) => (index === 0 ? "#414166" : "#eee"))
      .style("transform", `translate(${dimensions.width/2}px, ${dimensions.height-75}px)`)
      .attr("d", instruction => arcGenerator(instruction))

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("fill", "black")
        .style("font-size", 8)
        .style("transform", `translate(-20px)`)
        .style("transform", `translateY(60px)`)
        .text(`${completePercentDisplay}% Complete`)

    }, [data,dimensions])
  
  return (
    <div className="radial-chart-div" ref={wrapperRef} >
      <svg ref={svgRef}></svg>
    </div>
  )
}

export default RadialBarChart;