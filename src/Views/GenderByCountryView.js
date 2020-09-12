import React, { useState } from 'react'
import WorldMap from '../Components/WorldMap'
import data from '../Components/WorldData.geo.json'

function GenderByCountryView(){
  const [property, setProperty] = useState("pop_est")

  return (
    <div>
      <h1>Gender Gap By Country</h1>
      <h5>This will be the description of the plot data that's represented below</h5>
      <div className="input-area">
        <h2>Select Property to highlight</h2>
        <select 
          value={property}
          onChange={event => setProperty(event.target.value)}
        >
          <option value="pop_est">Population</option>
          <option value="name_len">Name Length</option>
          <option value="gdp_md_est">GDP</option>
        </select>
      </div>
      <WorldMap data={data} property={property} />
    </div>
  )
}

export default GenderByCountryView 