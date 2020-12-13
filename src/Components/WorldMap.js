import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear, zoom } from "d3";
import useResizeObserver from "./useResizeObserver";

function WorldMap({ mapData, property, extrema, genders }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // will be called initially and on every data change
  useEffect(() => {


    if (!mapData) return
    if (!property) return
    if (!extrema) return

    const svg = select(svgRef.current);
    const g = svg.select(".countries")
    const l = svg.select(".label")  
      const {width, height} = dimensions || wrapperRef.current.getBoundingClientRect() ;
      const projection = geoMercator().fitSize([width,height], mapData);
      
      //takes geojson data and transforms that into the d attribute of path element
      const pathGenerator = geoPath().projection(projection);
    if (mapData === null) {
      
    } else {
      const propertyValues = mapData.features.map(country => country.properties[property])
      const minProp = min(propertyValues)
      const maxProp = max(propertyValues)
      const colorScale = scaleLinear().domain([minProp, maxProp]).range(["#ccc", "#6200F8"])

      g
        .selectAll(".country")
        .data(mapData.features)
        .join("path")
        .on("click", (event,feature) => {
          setSelectedCountry(feature)
        })
        .attr("class", "country")
        .attr("fill", feature => colorScale(feature.properties[property]))
        .attr("d", feature => pathGenerator(feature))
      
      if(selectedCountry) {
        l 
        .selectAll(".label")
        .data([selectedCountry])        
        .join("text")
        .attr("class","label")
        .text(feature => feature.properties.text) 
        .attr("x", 0)
        .attr("y", dimensions.height - 10)
      }
         
      svg.call(zoom().on("zoom", (event) => {
        g.attr('transform', event.transform)
      }))
      
    }
    
  }, [mapData, dimensions, extrema, property, genders, selectedCountry]);

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
