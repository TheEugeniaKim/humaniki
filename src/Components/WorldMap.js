import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear, zoom } from "d3";
import useResizeObserver from "./useResizeObserver";

function WorldMap1({ mapData, property }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
      const g = svg.append('g');

      
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
      const colorScale = scaleLinear().domain([minProp, maxProp]).range(["#ccc", "#6200F8"]);

      g
        .selectAll(".country")
        .data(mapData.features)
        .join("path")
        .on("click", feature => {
          setSelectedCountry(selectedCountry === feature ? null : feature);
        })
        .attr("class", "country")
        .attr("fill", feature => colorScale(feature.properties[property]))
        .attr("d", feature => pathGenerator(feature))
        .append("title")
          .text(feature => 
            `${feature.properties.name} 
            men: ${feature.properties.men ? feature.properties.men : 0}
            women: ${feature.properties.women ? feature.properties.women : 0}
            percent men (%): ${feature.properties.menPercent ? feature.properties.menPercent : 0}%
            percent women (%): ${feature.properties.womenPercent ? feature.properties.womenPercent : 0}%`
          )
      
      svg.call(zoom().on("zoom", (event) => {
        g.attr('transform', event.transform)
      }))
      
    }
    
  }, [mapData,dimensions, property, selectedCountry]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg className="world-map"ref={svgRef}></svg>
    </div>
  );
}

export default WorldMap1;
