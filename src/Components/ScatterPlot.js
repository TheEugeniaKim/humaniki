
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
  const [stateDimensions, setStateDimensions] = useState({})

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    setStateDimensions(dimensions)
    const colorScale = scaleLinear()
      .domain([props.extrema.totalMin, props.extrema.totalMax])
      .range(["white", "#6200F8"])
      .clamp(true);

    const xScale = scaleLinear()
      .domain([0, 100])
      .range([0, stateDimensions.width]);

    const yScale = scaleLog()
      .domain([props.extrema.totalMin, props.extrema.totalMax])
      .range([stateDimensions.height, 0]) 
      
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      // .attr("transform", `translate(${-stateDimensions.height}px)`)
      .call(xAxis)
      
    const yAxis = axisLeft(yScale);
    svg
      .select(".y-axis")
      .attr("transform", `translateX(${stateDimensions.width}px)`)
      .call(yAxis)
      .append("title")
      .text("Total Human Content");

    svg
      .selectAll(".circle")
      .data(props.data)
      .join("circle")
      .attr("class", "circle")
      .style("transform", "scale(1, -1)")
      .attr("r", 6)
      .attr("cx", (obj, dataIndex) => xScale(obj.femalePercent))
      .attr("cy", (obj, dataIndex) => -yScale(obj.female))
      .attr("fill", (obj, dataIndex) => colorScale(obj.female))
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
      .attr("height", (value) => stateDimensions.height - yScale(value));
  }, [props, dimensions]);

  return (
    <div className="wrapper" ref={wrapperRef} >
      <svg ref={svgRef} className="svg-scatter">
        <g className="y-axis" />
          <text
            className="axis-label"
            textAnchor="middle"
            transform={`translate(${-50}, 
            ${stateDimensions.height / 2}) rotate(-90)`}
            style={{marginBottom:"20px"}}
          >
            {yAxisLabel}
          </text>
        <g className="x-axis" transform={`translate(${0},${stateDimensions.bottom})`} />
          <text
            className="axis-label"
            x={stateDimensions.width / 2}
            y={stateDimensions.height + 50}
            textAnchor="middle"
          >
            {xAxisLabel}
          </text>
      </svg>
    </div>
  );
}

export default ScatterPlot;