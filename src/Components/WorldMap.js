import React, {useRef, useEffect} from "react";
import {
    select,
    geoPath,
    geoMercator,
    min,
    max,
    scaleLinear,
    zoom,
    axisBottom
} from "d3";
import useResizeObserver from "./useResizeObserver";
import {genderColorsMap} from "../utils"

function WorldMap({mapData, property, extrema, genders}) {
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
        const key = svg.select('.key')
        const {width, height} = dimensions || wrapperRef.current.getBoundingClientRect();
        const projection = geoMercator().fitSize([width, height], mapData);
        //takes geojson data and transforms that into the d attribute of path element
        const pathGenerator = geoPath().projection(projection);
        if (mapData === null) {

        } else {
            const propertyValues = mapData.features.map(country => country.properties[property])
            const propertyPercent = property + "Percent"
            const propertyValuesPercents = mapData.features.map(country => country.properties[propertyPercent])
            const propertyValuesPercentsNums = propertyValuesPercents.map(s=>parseFloat(s))
            const minPropPercent = min(propertyValuesPercentsNums)
            const maxPropPercent = max(propertyValuesPercentsNums)
            const color = genderColorsMap[property] ? genderColorsMap[property] : genderColorsMap["sumOtherGenders"]
            const colorScalePercent = scaleLinear().domain([minPropPercent, maxPropPercent]).range(["#C4C4C4", color])

            g
                .selectAll(".country")
                .data(mapData.features)
                .join("path")
                .attr("class", feature => feature.properties.isSelected ? "country selectedCountry" : "country unSelectedCountry")
                .attr("fill", feature => colorScalePercent(feature.properties[propertyPercent]))
                // .attr("stroke", feature => colorScale(feature.properties[property]))
                // .attr("stroke-width", "0.1em")
                .attr("d", feature =>pathGenerator(feature))
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

            const legendHeight = height / 20

            key
                .select(".legendSvg")
                .attr("width", width)
                .attr("height", legendHeight)

            key
                .attr("style", "transform: translate(5%, 0) scale(0.9)")

            const legend = key.select(".legendDefs")
                .select("linearGradient")
                .attr("id", "gradient")
                .attr("x1", "0%")
                .attr("y1", "100%")
                .attr("x2", "100%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");

            legend.select("#zero")
                .attr("offset", "0%")
                .attr("stop-color", colorScalePercent(minPropPercent))
                .attr("stop-opacity", 1);

            legend.select("#hundred")
                .attr("offset", "100%")
                .attr("stop-color", colorScalePercent(maxPropPercent))
                .attr("stop-opacity", 1);

            key.select(".legendRect")
                .attr("width", width)
                .attr("height", legendHeight)
                .style("fill", "url(#gradient)")

            const y = scaleLinear()
                .domain([minPropPercent, maxPropPercent])
                .range([0, width])

            const yAxis = axisBottom()
                .scale(y)
                .ticks(5).tickFormat(d => d + "%")

            key.select(".legendG")
                .attr("transform", `translate(0,${legendHeight})`)
                .call(yAxis)
                .select("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("axis title");

        }

    }, [mapData, dimensions, extrema, property, genders]);

    return (
        <div ref={wrapperRef} style={{marginBottom: "2rem"}}>
            <svg className="world-map" ref={svgRef}>
                <g className="label"></g>
                <g className="countries"></g>
                <g className="key">
                    <svg className="legendSvg">
                    </svg>
                    <defs className="legendDefs">
                        <linearGradient className="legendLinearGradient">
                            <stop id="zero"></stop>
                            <stop id="hundred"></stop>
                        </linearGradient>
                    </defs>
                    <rect className="legendRect"></rect>
                    <g className="legendG">
                        <text></text>
                    </g>
                </g>   
            </svg>
        </div>
    )
}

export default WorldMap;
