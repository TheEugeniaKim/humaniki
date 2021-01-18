import React, { useRef, useEffect, useState } from 'react'
import '../App.css'
import { select, circle, line, scaleOrdinal, scaleLinear, axisBottom, axisRight, ascending, schemeSet3, zoom, zoomTransform, datum } from 'd3'
import ResizeObserver from "resize-observer-polyfill"

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null)
  useEffect(() => {
    const observeTarget = ref.current
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

function LineChart({lineData, graphGenders, extrema, genderMap, graphGenderFilter}){
  const svgRef = useRef()
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef)
  const [currentZoomState, setCurrentZoomState] = useState()

  useEffect(() => {
    if ( lineData.length === 0 || Object.keys(genderMap).length === 0 || Object.keys(extrema).length === 0 || !dimensions ) {
      return
    } else {
      const genderNums = genderMap ? Object.keys(genderMap).map(str => parseInt(str)) : []
      lineData.forEach(genderLine => sortGenderLine(genderLine))

      function sortGenderLine(genderLine){
        genderLine.values.sort((a, b) =>
          ascending(a.year, b.year)
        )
      }
      
      const svg = select(svgRef.current)
      const legend = select(".legend")
      const genderLineMaximums = lineData.map(genderLine => 
        Math.max(...genderLine.values.map(tuple => tuple.value))
      )
      const totalMaxYValue = Math.max(...genderLineMaximums)
      const yearMinimums = lineData.map(genderLine => 
        Math.min(...genderLine.values.map(tuple => tuple.year))
      )
      const yearMaximums = lineData.map(genderLine => 
        Math.max(...genderLine.values.map(tuple => tuple.year))
      )
      
      const totalMinXValue = Math.min(...yearMinimums)
      const totalMaxXValue = Math.max(...yearMaximums)

      const xScale = scaleLinear()
        .domain([totalMinXValue, totalMaxXValue+9])
        .range([0, dimensions.width])
        .nice()
        if (currentZoomState) {
          const newXScale = currentZoomState.rescaleX(xScale)
          xScale.domain(newXScale.domain())
        }

      const yScale = scaleLinear()
        .domain([0, totalMaxYValue])
        .range([dimensions.height, 0])
        .nice()
      
      const xAxis = axisBottom(xScale)
        .ticks(parseInt(10))
        .tickFormat(index => index + 1)

      const colorScale = scaleLinear()
        .domain(genderNums)
        .range(schemeSet3)

      svg
        .select(".x-axis")
        .style("transform", `translateY(${dimensions.height})px`)
        .call(xAxis)
      
      const yAxis = axisRight(yScale)
      svg
        .select(".y-axis")
        .style("transform", `translateX(${dimensions.width})px`)
        .call(yAxis)

      const myLine = line()
        .x((dp) => xScale(+dp.year))
        .y((dp) => yScale(+dp.value))

      svg
        .selectAll(".line")
        .data(lineData)
        .join("path")
        .attr("class", "line")
        .attr("d", (genderLine) => myLine(genderLine.values))
        .style("fill", "none")
        .attr("stroke", (genderLine) => colorScale(genderLine.name))
        .style("fill", "none")

      svg
        .selectAll(".scatter-group")
        .data(lineData)
        .join("g")
        .style("fill", (line) => colorScale(line.name))
        .attr("class", "scatter-group")
          .selectAll(".dp-circle")
          .data((line) => line.values)
          .join("circle")
          .attr("class", "dp-circle")
          .attr("r", 4) 
          .attr("cx", (dp) => xScale(dp.year))
          .attr("cy", (dp) => yScale(dp.value))
          .append("title")
            .text((dp) => `
              Value: ${dp.value}, 
              Year: ${dp.year}
            `)
        
      legend
        .selectAll(".legend")
        .data(lineData)
        .join("circle")
          .attr("class","legend")
          .style("transform", "scale(1, 1)")
          .attr("r", 6)
          .attr("cx", 32)
          .attr("cy", (line, index) => (index+1)*20 + 19)
          .attr("fill", (line) => colorScale(line.name))

      legend
        .selectAll(".text-legend")
        .data(lineData)
          .join("text")
          .attr("class","text-legend")
          .style("transform", "scale(1, 1)")
          .text((line) => genderMap[line.name])
          .attr("x", 40)
          .attr("y", (line, index) => (index+1)*20 + 19.5)
          .attr("fill", (line) => colorScale(line.name))

      const zoomBehavior = zoom()
        .scaleExtent([0.5, 5])
        .translateExtent([
          [0, 0],
          [dimensions.width, dimensions.height]
        ])
        .on("zoom", () => {
          const zoomState = zoomTransform(svg.node())
          setCurrentZoomState(zoomState)
        })
      
      svg
        .call(zoomBehavior)
    }
  }, [currentZoomState, lineData, graphGenders, extrema, genderMap, graphGenderFilter, dimensions])

  return (
    <React.Fragment>
      <div className="wrapper" ref={wrapperRef} >
        <svg ref={svgRef} className="svg-chart" >
          <g className="x-axis" />
          <g className="y-axis" />
          <g className="legend" />
        </svg>
      </div>
    </React.Fragment>
  )
}

export default LineChart