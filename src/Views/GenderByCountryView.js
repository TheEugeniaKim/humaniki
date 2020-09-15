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
        <div>
          <p>
            Note: As for January, 2016, only about 30% of biographies had place
            of birth, so this data is incomplete.
          </p>
        </div>
      </div>
      <WorldMap data={data} />
    </div>
  )
}

export default GenderByCountryView 