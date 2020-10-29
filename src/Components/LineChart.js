import React, { useRef, useEffect, useState } from 'react'
import '../App.css'
import { select, line, curveCardinal, scaleLinear, axisBottom, axisLeft, ascending, extent } from 'd3'
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
  const svgRef = useRef()
  const wrapperRef = useRef()
  const dimensions = useResizeObserver(wrapperRef)
  
  useEffect(() => {
    if (!dimensions) return
    props.lineData.sort((a, b) =>
      ascending(a.year, b.year)
    )
    
    const svg = select(svgRef.current);
    const xValues = props.lineData.map(dp => dp.year)
    const yValues = props.lineData.map(dp => dp.value)   
    const xValue = dp => dp.year
    const yValue = dp => dp.value

    const xScale = scaleLinear()
      .domain(extent(props.lineData, xValue))
      .range([0, 300])
      .nice();
  
    const yScale = scaleLinear()
      .domain(extent(props.lineData, yValue))
      .range([150, 0])
      .nice();

    const xAxis = axisBottom(xScale)
      .ticks(parseInt(xValues.length/20))
      .tickFormat(index => index + 1);
    svg
      .select(".x-axis")
      .style("transform", "translateY(150px)")
      .call(xAxis);
    
    const yAxis = axisLeft(yScale);
    svg
      .select(".y-axis")
      .style("transform", "translateX(300px)")
      .call(yAxis);

    const myLine = line()
      .x((dp) => xScale(dp.year))
      .y((dp) => yScale(dp.value))
      .curve(curveCardinal)
    
    svg
      .selectAll(".line")
      .data([props.lineData])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "blue")
    
      
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