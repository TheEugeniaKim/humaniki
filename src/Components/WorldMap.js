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
      const g = svg.append('g')

      
      const {width, height} = dimensions || wrapperRef.current.getBoundingClientRect() ;
      const projection = geoMercator().fitSize([width,height], selectedCountry || mapData);
      
      //takes geojson data and transforms that into the d attribute of path element
      const pathGenerator = geoPath().projection(projection);
    if (mapData === null) {
      
    } else {
      const minProp = min(mapData.features, feature => feature.properties[property]);
      const maxProp = max(mapData.features, feature => feature.properties[property]);
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
          men: ${feature.properties.men}
          women: ${feature.properties.women}
          non-binary: ${feature.properties["non-binary"]}
          percent men (%): ${feature.properties["percent-men"]}%
          percent women (%): ${feature.properties["percent-women"]}%
          percent non-binary (%): ${feature.properties["percent-non-binary"]}%
        `)
      
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
