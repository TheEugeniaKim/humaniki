import React, { useRef, useEffect, useState } from "react";
import "../App.css";
import { select, scaleLinear, scaleLog, axisBottom, axisLeft } from "d3";
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
  const yAxisLabel = "Total Human Content";
  const xAxisLabel = "Percentage Female Content";

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) {
      return;
    } else {
      const colorScale = scaleLinear()
        .domain([props.extrema.totalMin, props.extrema.totalMax])
        .range(["white", "#6200F8"])
        .clamp(true);

      // TODO: what's this snake case doing here?
      const max_perc_plus_a_bit = props.extrema.percentMax * 1.15;
      const min_perc_minus_a_bit = props.extrema.percentMin * 0.85;
      const xScale = scaleLinear()
        .domain([min_perc_minus_a_bit, max_perc_plus_a_bit])
        .range([0, dimensions.width]);

      const max_plus_a_bit = props.extrema.totalMax * 1.15;
      const min_minus_a_bit = props.extrema.totalMin * 0.85;
      const yScale = scaleLinear()
        .domain([min_minus_a_bit, max_plus_a_bit])
        .range([dimensions.height, 0]);

      const xAxis = axisBottom(xScale);
      svg
        .select(".x-axis")
        .attr("class", "x-axis")
        .attr("transform", `translate(${0}, ${dimensions.bottom})`)
        .call(xAxis);

      svg
        .select(".x-axis-title-text")
        .text(xAxisLabel)
        .attr("x", `${dimensions.width / 2}`)
        .attr("y", `${dimensions.height + 50}`)
        .attr("text-anchor", "middle")
        .attr("class", "x-axis-title-text");

      const yAxis = axisLeft(yScale);
      svg.select(".y-axis").call(yAxis);

      svg
        .select(".y-axis-title-text")
        .text(yAxisLabel)
        .attr(
          "transform",
          `translate(${-50}, 
          ${dimensions.height / 2}) rotate(-90)`
        )
        .attr("text-anchor", "middle");

      svg.selectAll(".node").remove();

      const nodes = svg
        .selectAll(".node")
        .data(props.data)
        .join("g")
        .attr("class", "node");

      nodes
        .append("circle")
        .attr("r", 6)
        .attr("cx", (obj, dataIndex) =>
          obj.femalePercent ? xScale(obj.femalePercent) : xScale(0)
        )
        .attr("cy", (obj, dataIndex) =>
          obj.total ? yScale(obj.total) : yScale(0)
        )
        .attr("fill", (obj, dataIndex) =>
          obj.female ? colorScale(obj.female) : colorScale(0)
        )
        .attr("stroke", "black")
        .attr("class", "circle");

      nodes.append("title").text(
        (obj) => `
          ${obj.language}
          Total Bios: ${obj.total}
          Total Women Bios: ${obj.female}
          Women: ${obj.femalePercent}%
        `
      );
      nodes
        .append("text")
        .attr("dx", (obj, dataIndex) =>
          obj.femalePercent ? xScale(obj.femalePercent) + 10 : xScale(0)
        )
        .attr("dy", (obj, dataIndex) =>
          obj.total ? yScale(obj.total) + 3 : yScale(0)
        )
        .attr("fill", "black")
        .text(function (obj) {
          return obj.project;
        });
    }
  }, [props, dimensions]);

  return (
    <div className="wrapper" ref={wrapperRef}>
      <svg ref={svgRef} className="svg-scatter">
        <g className="y-axis"></g>
        <g className="y-axis-title" />
        <text className="y-axis-title-text"></text>
        <g className="x-axis" />
        <g className="x-axis-title" />
        <text className="x-axis-title-text"></text>
      </svg>
    </div>
  );
}

export default ScatterPlot;
