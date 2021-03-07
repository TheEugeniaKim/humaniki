import React, { useRef, useEffect } from "react";
import "../App.css";
import "../Sk.css";
// import * as d3 from 'd3'
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
        .text(`${completePercentDisplay}% data Complete`)

    }, [data,dimensions])
  
  return (
    <div className="radial-chart-div" ref={wrapperRef} >
      <svg ref={svgRef}></svg>
    </div>
  )


  // const ref = useRef(null)
  // const createPie = d3
  //   .pie()
  //   .value(data => data.value)
  //   .sort(null)
  // const createArc = d3
  //   .arc()
  //   .innerRadius(75)
  //   .outerRadius(100)
  // const colors = d3.scaleOrdinal(["#00BCA1","#BC8F00","#6200F8"])
 
  // useEffect(() => {
  //   const data = createPie(props.data)
  //   // const percentWomen = props.data.filter(obj => obj.label === "women")[0].value
  //   const group = d3.select(ref.current)
  //   const groupWithData = group.selectAll("g.arc").data(data)

  //   groupWithData.exit().remove()

  //   const groupWithUpdate = groupWithData
  //     .enter()
  //     .append("g")
  //     .attr("class", "arc")
    
  //   const path = groupWithUpdate
  //     .append("path")
  //     .merge(groupWithData.select("path.arc"))
    
  //   path  
  //     .attr("class", "arc")
  //     .attr("d", createArc)
  //     .attr("fill", (d,i) => colors(i))
    
  //   const text = groupWithUpdate
  //     .append("text")
  //     .merge(groupWithData.select("text"));
  //   text
  //     .attr("text-anchor", "middle")
  //     .attr("alignment-baseline", "middle")
  //     .style("fill", "black")
  //     .style("font-size", 8)
  //     // .text(d => `${percentWomen}% Women`)
  // })

  // return (
  //   <div>
  //     <svg className="button-svg" width={props.width} height={props.height}>
  //       <g 
  //         ref={ref}
  //         transform={`translate(${props.outerRadius} ${props.outerRadius})`}
  //       />
  //     </svg>
  //   </div>
  // )
}

export default RadialBarChart;