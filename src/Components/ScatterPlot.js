
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
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis)
      
    const yAxis = axisLeft(yScale);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${dimensions.width}px)`)
      .call(yAxis)
      .style("fill", "black")
      .append("title")
      .text("Total Biographies");

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
      .attr("height", (value) => dimensions.height - yScale(value));
  }, [props, dimensions]);

  return (
    <div className="wrapper" ref={wrapperRef} >
      <svg ref={svgRef} className="svg">
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default ScatterPlot;