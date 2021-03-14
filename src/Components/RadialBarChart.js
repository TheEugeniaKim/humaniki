import React, { useRef, useEffect } from "react";
import "../App.css";
import "../Sk.css";
import { select, arc, pie, interpolate } from "d3";
import useResizeObserver from "./useResizeObserver";

function RadialBarChart({ data }) {
  // data is a tuple for the completeness where [completeness, 1 - completeness]
  // and completeness is a float between 0 and 1
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    const arcGenerator = arc().innerRadius(35).outerRadius(45);
    const pieGenerator = pie();
    const instructions = pieGenerator(data);
    const completePercentDisplay = data[0].toFixed(1) * 100;

    svg
      .selectAll(".slice")
      .data(instructions)
      .join("path")
      .attr("class", "slice")
      .attr("stroke", "black")
      .attr("fill", (instruction, index) => (index === 0 ? "#414166" : "#eee"))
      .style(
        "transform",
        `translate(${dimensions.width / 2}px, ${dimensions.height - 75}px)`
      )
      .attr("d", (instruction) => arcGenerator(instruction));

    svg
      .selectAll(".completeness-svg-text")
      .data(data)
      .attr("class", "completeness-svg-text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("fill", "black")
      .style("font-size", 8)
      .style(
        "transform",
        `translateX(${dimensions.width / 2}px) translateY(${
          dimensions.height / 2 + 10
        }px) `
      )
      .text((d) => `${completePercentDisplay}%`);

    svg
      .selectAll(".completeness-svg-text-humans")
      .data(data)
      .attr("class", "completeness-svg-text-humans")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("fill", "black")
      .style("font-size", 8)
      .style(
        "transform",
        `translateX(${dimensions.width / 2}px) translateY(${
          dimensions.height / 2 + 20
        }px) `
      );
  }, [data, dimensions]);

  return (
    <div className="radial-chart-div" ref={wrapperRef}>
      <svg ref={svgRef}>
        <text className="completeness-svg-text"></text>
        <text className="completeness-svg-text-humans">Humans</text>
      </svg>
    </div>
  );
}

export default RadialBarChart;
