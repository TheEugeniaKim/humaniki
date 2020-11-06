import React, { useRef, useEffect, useState } from 'react'
import '../App.css'
import { select, circle, line, scaleOrdinal, scaleLinear, axisBottom, axisRight, ascending, schemeSet3, zoom, zoomTransform } from 'd3'
import ResizeObserver from "resize-observer-polyfill"
import { Dropdown } from 'bootstrap'

const useResizeObserver = (ref) => {
  // genderLabels = ["transgendermen", "men", "women"]
  // genderQids = [32]
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
  // console.log(props)
  const svgRef = useRef()
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef)
  // const [currentZoomState, setCurrentZoomState] = useState()

  useEffect(() => {
    if (!dimensions) return
    console.log(props.lineData, props.extrema, props.genderMap)
    const genderNums = props.genderMap ? Object.keys(props.genderMap).map(str => parseInt(str)) : []
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
    .domain([totalMinXValue, totalMaxXValue+9])
    .range([0, dimensions.width])
    .nice()
    // if (currentZoomState) {
    //   const newXScale = currentZoomState.rescaleX(xScale);
    //   xScale.domain(newXScale.domain());
    // }

    const yScale = scaleLinear()
    .domain([0, totalMaxYValue])
    .range([dimensions.height, 0])
    .nice()
    
    const xAxis = axisBottom(xScale)
      .ticks(parseInt(10))
      .tickFormat(index => index + 1);

    const colorScale = scaleLinear()
      .domain(genderNums)
      .range(schemeSet3);

    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height})px`)
      .call(xAxis);
    
    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${dimensions.width})px`)
      .call(yAxis);

      const myLine = line()
        .x((dp) => xScale(+dp.year))
        .y((dp) => yScale(+dp.value))

        svg
        .selectAll(".line")
        .data(props.lineData)
        .join("path")
        .attr("class", "line")
        .attr("d", (genderLine) => myLine(genderLine.values))
        .style("fill", "none")
        .attr("stroke", (genderLine) => colorScale(genderLine.name))
        .style("fill", "none")

        // const testArr = props.lineData[1]
      // let exampleData= [ {year: 124, value: 2}, {year: 24, value: 5}, {year:0, value: 8 }]

      svg
        .selectAll(".dots")
        .data(props.lineData)
        .join("g")
        .style("fill", (line) => colorScale(line.name))
        .attr("class", "scatter-group")
          .selectAll(".points")
          .data((line) => line.values)
          .join("circle")
          .attr("class", "circle")
          .attr("r", 4) 
          .attr("cx", (dp) => xScale(dp.year))
          .attr("cy", (dp) => yScale(dp.value))
          .append("title")
            .text((dp) => `Value: ${dp.value}`)
      
      svg
        .selectAll(".labels")
        .data(props.lineData)
        .append("g")
        .append("text")
        .datum((dp) => { return {name: dp.name, value: dp.values[dp.values.length - 1]}; }) // keep only the last value of each time series
        .attr("transform", (dp) =>  "translate(" + xScale(dp.value.year) + "," + yScale(dp.value.value) + ")" ) // Put the text at the position of the last point
        .attr("x", 12) // shift the text a bit more right
        .text((dp) => dp.name )
        .style("fill", (dp) => colorScale(dp.name) )
        .style("font-size", 15)
      
        // zoom
    // const zoomBehavior = zoom()
    // .scaleExtent([0.5, 5])
    // .translateExtent([
    //   [0, 0],
    //   [dimensions.width, dimensions.height]
    // ])
    // .on("zoom", () => {
    //   const zoomState = zoomTransform(svg.node());
    //   setCurrentZoomState(zoomState);
    // })
    
    // svg
    //   .call(zoomBehavior)

  }, [ props, dimensions])

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