import React, { useRef, useEffect, useState } from "react";
import "../App.css";
import {
  select,
  scaleBand,
  scaleLinear,
  axisBottom,
  axisRight,
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
    console.log(data.data, data.extrema);
    const svg = select(svgRef.current);
    if (!dimensions) return;

    const colorScale = scaleLinear()
      .domain([0, 30])
      .range(["white", "purple"])
      .clamp(true);

    const xScale = scaleLinear()
      .domain([data.extrema.percentMin, data.extrema.percentMax])
      .range([0, dimensions.width]);

    const yScale = scaleLinear()
      .domain([data.extrema.totalMin, data.extrema.totalMax])
      .range([dimensions.height, 0]); // 150 pixels is the size of the svg

    const xAxis = axisBottom(xScale)
      .ticks(7)
      .tickFormat((index) => index + 1);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis)
      .style("fill", "red");

    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${dimensions.width}px)`)
      .call(yAxis)
      .style("fill", "red");

    svg
      .selectAll(".circle")
      .data(data.data)
      .join("circle")
      .attr("class", "circle")
      .style("transform", "scale(1, -1)")
      .attr("r", 8)
      .attr("cx", (obj, dataIndex) => xScale(obj.womenPercent))
      .attr("cy", (obj, dataIndex) => -yScale(obj.women))
      // .attr("fill", (obj,dataIndex) => colorScale(obj.women))
      .append("title")
      .text(
        (obj) => `
          ${obj.language}
          total bios: ${obj.total}
          total women bios: ${obj.women}
          women: ${obj.womenPercent}%
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
    <div className="wrapper" ref={wrapperRef} style={{ margin: "100px" }}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default ScatterPlot;
