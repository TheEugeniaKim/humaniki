import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear, zoom } from "d3";
import useResizeObserver from "./useResizeObserver";

function WorldMap({ mapData, property, extrema, genders }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);

  function generateLabel(feature, genders){
    // console.log(feature, genders)
    let country = feature.properties.name
    let label = country
    // for (let i=0; i<genders.length; i++){
    //   if (feature["properties"][genders[i]]){
    //     console.log(feature["properties"][genders[i]], "matched")
    //     let gender = genders[i]
    //     let value = feature.properties[genders[i]]
    //     let valuePercent = (value/feature.properties.total*100).toFixed(3)
    //     // console.log("here", gender,value,valuePercent)
    //     return label = label + `${gender}: ${value} (${valuePercent}%)`
    //   }
    // }

    genders.forEach(gender => {
    
      if (feature["properties"][gender]){
        let value = feature.properties[gender]
        let valuePercent = (value/feature.properties.total*100).toFixed(3)
        return label = label + ` ${gender}: ${value} (${valuePercent}%)`

      }
    })
    // console.log("genderLabels", genderLabels)
    console.log("label", label)
    return label
  }

  // will be called initially and on every data change
  useEffect(() => {
    console.log("world map", mapData, genders)
    if (!mapData) return
    if (!property) return
    if (!extrema) return

    const svg = select(svgRef.current);
    const g = svg.select(".countries")
      
      const {width, height} = dimensions || wrapperRef.current.getBoundingClientRect() ;
      const projection = geoMercator().fitSize([width,height], mapData);
      
      //takes geojson data and transforms that into the d attribute of path element
      const pathGenerator = geoPath().projection(projection);
    if (mapData === null) {
      
    } else {
      const propertyValues = mapData.features.map(country => country.properties[property])
      const minProp = min(propertyValues)
      const maxProp = max(propertyValues)
      console.warn(minProp, maxProp)
      const colorScale = scaleLinear().domain([minProp, maxProp]).range(["#ccc", "#6200F8"])

      g
        .selectAll(".country")
        .data(mapData.features)
        .join("path")
        .attr("class", "country")
        .attr("fill", feature => colorScale(feature.properties[property]))
        .attr("d", feature => pathGenerator(feature))
        .append("title")
        .text(feature => feature.properties.text)
      
      svg.call(zoom().on("zoom", (event) => {
        g.attr('transform', event.transform)
      }))
      
    }
    
  }, [mapData, dimensions, extrema, property, genders, selectedCountry]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg className="world-map"ref={svgRef}>
        <g className="countries"></g>
      </svg>
    </div>
  );
}

export default WorldMap;
