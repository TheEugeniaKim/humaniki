import React, { useRef, useEffect, useState } from 'react'
import '../App.css'
import { select, line, curveCardinal, scaleLinear, axisBottom, axisRight, ascending, extent } from 'd3'
import ResizeObserver from "resize-observer-polyfill"
import { Dropdown } from 'bootstrap'

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null)
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect)
      })
    })
    resizeObserver.observe(observeTarget)
    return () => {
      resizeObserver.unobserve(observeTarget)
    }
  }, [ref])
  return dimensions
}

function LineChart(props){
  console.log(props)
  const svgRef = useRef()
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef)
  
  useEffect(() => {
    if (!dimensions) return
    console.log(props.lineData, props.extrema)
    props.lineData.forEach(genderLine => sortGenderLine(genderLine))

    function sortGenderLine(genderLine){
      genderLine.values.sort((a, b) =>
        ascending(a.year, b.year)
      )
    }
    
    const svg = select(svgRef.current);
    const genderLineMaximums = props.lineData.map(genderLine => 
      Math.max(...genderLine.values.map(tuple => tuple.value))
    )
    const totalMaxYValue = Math.max(...genderLineMaximums)
    const yearMinimums = props.lineData.map(genderLine => 
      Math.min(...genderLine.values.map(tuple => tuple.year))
    )
    const yearMaximums = props.lineData.map(genderLine => 
      Math.max(...genderLine.values.map(tuple => tuple.year))
    )
    
    const totalMinXValue = Math.min(...yearMinimums)
    const totalMaxXValue = Math.max(...yearMaximums)

    const xScale = scaleLinear()
    .domain([totalMinXValue, totalMaxXValue])
    .range([0, dimensions.width])
    .nice()
    // .domain(extent(props.lineData, xValue))
  
    const yScale = scaleLinear()
    .domain([0, totalMaxYValue])
    .range([dimensions.height, 0])
    .nice()
    
    const xAxis = axisBottom(xScale)
      .ticks(parseInt(10))
      .tickFormat(index => index + 1);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height})px`)
      .call(xAxis);
    
    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${dimensions.width})px`)
      .call(yAxis);

      Object.values(props.graphGenders).map(gender => {
        console.log(gender)

      })
      const myLine = line()
        .x((dp) => xScale(+dp.year))
        .y((dp) => yScale(+dp.value))
        // .curve(curveCardinal)
     // var line = d3.line()
      // .x(function(d) { return x(+d.time) })
      // .y(function(d) { return y(+d.value) })

      svg
        .selectAll(".line")
        .data(props.lineData)
        .join("path")
        .attr("class", "line")
        .attr("d", function(genderLine){ return myLine(genderLine.values) })
        .attr("fill", "none")
        .attr("stroke", "blue")
  
         // Add the lines

     
      // svg.selectAll("myLines")
      //   .data(dataReady)
      //   .enter()
      //   .append("path")
      //     .attr("d", function(d){ return line(d.values) } )
      //     .attr("stroke", function(d){ return myColor(d.name) })
      //     .style("stroke-width", 4)
      //     .style("fill", "none")

  }, [props, dimensions])

  return (
    <React.Fragment>
      <div className="wrapper" ref={wrapperRef} >
        <svg ref={svgRef} className="svg">
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </React.Fragment>
  );
}

export default LineChart