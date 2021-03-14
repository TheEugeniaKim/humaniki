import React, { useEffect, useRef } from "react";
import { select } from "d3";
import { colors } from "../utils";

function SingleBarChart(props) {
  const svgRef = useRef();

  useEffect(() => {
    if (!props.genderTotals) {
      return;
    }
    const svg = select(svgRef.current);

    let percentSoFar = 0;
    let genderTotalArr = [];
    props.genderTotals.forEach((percent) => {
      genderTotalArr.push({ percent: percent, percentSoFar: percentSoFar });
      percentSoFar += percent;
    });
    svg
      .selectAll("rect")
      .data(genderTotalArr)
      .join("rect")
      .attr("fill", function (d, i) {
        return colors[i];
      })
      .attr("width", (value) => value.percent + "%")
      .attr("height", "100%")
      .attr("x", (value) => value.percentSoFar + "%");
  }, [props.genderTotals]);

  return <svg ref={svgRef} className="svg-single-bar"></svg>;
}

export default SingleBarChart;
