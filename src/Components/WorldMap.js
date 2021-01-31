import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLog, scaleLinear, zoom, scaleSequential, interpolatePurples} from "d3";
import useResizeObserver from "./useResizeObserver";

function WorldMap({ mapData, property, extrema, genders }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    if (!mapData) return
    if (!property) return
    if (!extrema) return
    const svg = select(svgRef.current);
    const g = svg.select(".countries")
    // const l = svg.select(".label")  
    const {width, height} = dimensions || wrapperRef.current.getBoundingClientRect() ;
    const projection = geoMercator().fitSize([width,height], mapData);
      
      //takes geojson data and transforms that into the d attribute of path element
      const pathGenerator = geoPath().projection(projection);
    if (mapData === null) {
      
    } else {
      const propertyValues = mapData.features.map(country => country.properties[property])
      const minProp = min(propertyValues)
      const maxProp = max(propertyValues)
      console.log("MIN MAX", minProp, maxProp, property)
      // const logScale = scaleLog().domain([.001, maxProp]).range(["#C4C4C4", "#6200F8"])
      // const colorScale = scaleSequential(
      //   (d) => interpolatePurples(logScale(d))
      // ) 
      const colorScale = scaleLinear().domain([minProp, maxProp]).range(["#C4C4C4", "#6200F8"])

      g
        .selectAll(".country")
        .data(mapData.features)
        .join("path")
        .attr("class", feature => feature.properties.isSelected ? "country selectedCountry" : "country unSelectedCountry")
        .attr("fill", feature => colorScale(feature.properties[property]))
        .attr("d", feature => pathGenerator(feature))
        .append("title")
          .text((value) => value.properties.text ? 
            `${value.properties.name}: 
            Male: ${value.properties.malePercent}%
            Female: ${value.properties.femalePercent}%
            ∑ Other Genders: ${value.properties.sumOtherGendersPercent ? value.properties.sumOtherGendersPercent : 0}%
            `
          : 
            `${value.properties.name}
            (No Data Available)
            `
          )

      svg.call(zoom().on("zoom", (event) => {
        g.attr('transform', event.transform)
      }))
      
    }
    
  }, [mapData, dimensions, extrema, property, genders]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg className="world-map"ref={svgRef}>
        <g className="label"></g>
        <g className="countries"></g>
      </svg>
    </div>
  )
}

export default WorldMap;
