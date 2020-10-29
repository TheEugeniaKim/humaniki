import React, { useRef, useEffect, useState } from "react";
import '../App.css'
import {
  select,
  scaleLinear,
  scaleLog,
  axisBottom,
  axisLeft,
  selection,
  color,
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

function ScatterPlot(data) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    console.log(data.data, data.extrema, dimensions);
    const svg = select(svgRef.current);
    if (!dimensions) return;

    const colorScale = scaleLinear()
      .domain([data.extrema.totalMin, data.extrema.totalMax])
      .range(["white", "#6200F8"])
      .clamp(true);

    const xScale = scaleLinear()
      .domain([data.extrema.percentMin, data.extrema.percentMax+10])
      .range([0, dimensions.width]);

    const yScale = scaleLog()
      .domain([data.extrema.totalMin, data.extrema.totalMax])
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
      .data(data.data)
      .join("circle")
      .attr("class", "circle")
      .style("transform", "scale(1, -1)")
      .attr("r", 6)
      .attr("cx", (obj, dataIndex) => xScale(obj.womenPercent))
      .attr("cy", (obj, dataIndex) => -yScale(obj.women))
      .attr("fill", (obj, dataIndex) => colorScale(obj.women))
      .attr("stroke", "black")
      .append("title")
      .text(
        (obj) => `
          ${obj.language}
          Total Bios: ${obj.total}
          Total Women Bios: ${obj.women}
          Women: ${obj.womenPercent}%
        `
      )
      // .on("mouseenter", function(event, d) {
      //   const e = svg.nodes()
      //   const i = e.indexOf(this)
      //   console.log(e, i, d)
      //   svg.append("title")
      //     .text(d =>

      //       // console.log(obj)
      //       `hello ${d.name}`
      //       // `name: ${obj["name"]}`
      //     )
      // })
      // .on("mouseleave", () =>
      //   svg.select(".d3tooltip").remove()
      // )
      .transition()
      .attr("fill", colorScale())
      .attr("height", (value) => dimensions.height - yScale(value));
  }, [data, dimensions]);

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
