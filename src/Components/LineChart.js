import React, { useRef, useEffect, useState } from "react";
import "../App.css";
import {
  select,
  line,
  scaleOrdinal,
  scaleLinear,
  axisBottom,
  axisLeft,
  ascending,
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

function LineChart({
  lineData,
  graphGenders,
  extrema,
  genderMap,
  graphGenderFilter,
}) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  // const [currentZoomState, setCurrentZoomState] = useState()
  const [stateDimensions, setStateDimensions] = useState(null);
  const xAxisLabel = "Years";
  const yAxisLabel = "Number of Biographies and Other Content";

  useEffect(() => {
    if (
      lineData.length === 0 ||
      Object.keys(genderMap).length === 0 ||
      Object.keys(extrema).length === 0 ||
      !dimensions
    ) {
      return;
    }
    setStateDimensions(dimensions);
    lineData.forEach((genderLine) => sortGenderLine(genderLine));

    function sortGenderLine(genderLine) {
      genderLine.values.sort((a, b) => ascending(a.year, b.year));
    }

    const svg = select(svgRef.current);

    const legend = select(".legend");
    const genderLineMaximums = lineData.map((genderLine) =>
      Math.max(...genderLine.values.map((tuple) => tuple.value))
    );
    const totalMaxYValue = Math.max(...genderLineMaximums);
    const yearMinimums = lineData.map((genderLine) =>
      Math.min(...genderLine.values.map((tuple) => tuple.year))
    );
    const yearMaximums = lineData.map((genderLine) =>
      Math.max(...genderLine.values.map((tuple) => tuple.year))
    );

    const totalMinXValue = Math.min(...yearMinimums);
    const totalMaxXValue = Math.max(...yearMaximums);

    const colorScale = scaleOrdinal(["#517FC1", "#F19359", "#FAD965"]).domain([
      "male",
      "female",
      "sumOtherGenders",
    ]);

    const xScale = scaleLinear()
      .domain([totalMinXValue, totalMaxXValue + 9])
      .range([0, dimensions.width])
      .nice();
    // Removed Zoom Behavior for alpha release because overflow: visible:
    // if (currentZoomState) {
    //   const newXScale = currentZoomState.rescaleX(xScale)
    //   xScale.domain(newXScale.domain())
    // }
    const xAxis = axisBottom(xScale)
      .ticks(parseInt(10))
      .tickFormat((index) => index + 1);
    svg
      .select(".x-axis")
      .attr("transform", `translate(${0}, ${dimensions.bottom})`)
      .call(xAxis);
    svg
      .select(".x-axis-title-text")
      .text(xAxisLabel)
      .attr("x", `${dimensions.width / 2}`)
      .attr("y", `${dimensions.height + 50}`)
      .attr("text-anchor", "middle")
      .attr("class", "x-axis-title-text");

    const yScale = scaleLinear()
      .domain([0, totalMaxYValue])
      .range([dimensions.height, 0])
      .nice();
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

    const myLine = line()
      .x((dp) => xScale(+dp.year))
      .y((dp) => yScale(+dp.value));

    svg
      .selectAll(".line")
      .data(lineData)
      .join("path")
      .attr("class", "line")
      .attr("d", (genderLine) => myLine(genderLine.values))
      .style("fill", "none")
      .attr("stroke", (genderLine) => colorScale(genderLine.name))
      .style("fill", "none");

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
      .text(
        (dp) => `
            Value: ${dp.value}, 
            Year: ${dp.year}
          `
      );

    legend
      .selectAll(".legend")
      .data(lineData)
      .join("circle")
      .attr("class", "legend")
      .style("transform", "scale(1, 1)")
      .attr("r", 6)
      .attr("cx", 50)
      .attr("cy", (line, index) => (index + 1) * 20 + 25)
      .attr("fill", (line) => colorScale(line.name));

    legend
      .selectAll(".text-legend")
      .data(lineData)
      .join("text")
      .attr("class", "text-legend")
      .style("transform", "scale(1, 1)")
      .text((line) => line.name)
      .attr("x", 60)
      .attr("y", (line, index) => (index + 1) * 20 + 30)
      .attr("fill", (line) => colorScale(line.name));

    // Disabled Zoom Behavior for alpha release because overflow:visible:
    // const zoomBehavior = zoom()
    //   .scaleExtent([0.5, 5])
    //   .translateExtent([
    //     [0, 0],
    //     [dimensions.width, dimensions.height]
    //   ])
    //   .on("zoom", () => {
    //     const zoomState = zoomTransform(svg.node())
    //     setCurrentZoomState(zoomState)
    //   })

    // svg
    //   .call(zoomBehavior)
  }, [
    lineData,
    graphGenders,
    extrema,
    genderMap,
    graphGenderFilter,
    dimensions,
    stateDimensions,
  ]);
  return (
    <React.Fragment>
      <div className="wrapper" ref={wrapperRef}>
        <svg ref={svgRef} className="svg-chart">
          <g className="x-axis" />
          <g className="x-axis-title" />
          <text className="x-axis-title-text"></text>
          <g className="y-axis" />
          <g className="y-axis-title" />
          <text className="y-axis-title-text"></text>
          <g className="legend" />
        </svg>
      </div>
    </React.Fragment>
  );
}

export default LineChart;
