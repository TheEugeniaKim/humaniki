
import React, { useRef, useEffect, useState } from "react";
import '../App.css'
import {
  select,
  scaleLinear,
  scaleLog,
  axisBottom,
  axisLeft
} from "d3";
import ResizeObserver from "resize-observer-polyfill";

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

function ScatterPlot(props) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const yAxisLabel = "Total Human Content"
  const xAxisLabel = "Percentage Women Content"

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    const colorScale = scaleLinear()
      .domain([props.extrema.totalMin, props.extrema.totalMax])
      .range(["white", "#6200F8"])
      .clamp(true);

    const xScale = scaleLinear()
      .domain([0, 100])
      .range([0, dimensions.width]);

    const yScale = scaleLog()
      .domain([props.extrema.totalMin, props.extrema.totalMax])
      .range([dimensions.height, 0]) 
      
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(${0}, ${dimensions.bottom})`)
      .call(xAxis)
      
    svg
      .select(".x-axis-title-text")
      .text(xAxisLabel)
        .attr("x", `${dimensions.width / 2}`)
        .attr("y", `${dimensions.height + 50}`)
        .attr("text-anchor", "middle")

    const yAxis = axisLeft(yScale);
    svg
      .select(".y-axis")
      .call(yAxis)

    svg.select(".y-axis-title-text")
      .text(yAxisLabel)
        .attr("transform", `translate(${-50}, 
          ${dimensions.height / 2}) rotate(-90)`)
        .attr("text-anchor", "middle")      
  
    svg
      .selectAll(".circle")
      .data(props.data)
      .join("circle")
      .attr("class", "circle")
      .attr("r", 6)
      .attr("cx", (obj, dataIndex) => obj.femalePercent ? xScale(obj.femalePercent) : 0)
      .attr("cy", (obj, dataIndex) => obj.female ? yScale(obj.female) : 0)
      .attr("fill", (obj, dataIndex) => obj.female ? colorScale(obj.female) : 0)
      .attr("stroke", "black")
      .append("title")
      .text(
        (obj) => `
          ${obj.language}
          Total Bios: ${obj.total}
          Total Women Bios: ${obj.female}
          Women: ${obj.femalePercent}%
        `
      )
      .transition()
      .attr("fill", colorScale())
      .attr("height", (value) => dimensions.height - yScale(value));

    
  }, [props, dimensions]);

  return (
    <div className="wrapper" ref={wrapperRef} >
      <svg ref={svgRef} className="svg-scatter">
        <g className="y-axis" ></g>
        <g className="y-axis-title" />
          <text className="y-axis-title-text"></text>
        <g className="x-axis" />
        <g className="x-axis-title"/>
          <text className="x-axis-title-text"></text>
      </svg>
    </div>
  );
}

export default ScatterPlot;