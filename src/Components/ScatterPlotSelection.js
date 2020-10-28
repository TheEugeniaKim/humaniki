import React, { useState } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'

function ScatterPlotSelection(props){
  console.log("Scatter section", props.data)

  function handleChecks(e){
    let filter = []
    console.log(e.target.value)
  }

  
  return props.data.map(langObj => {
    return (
      <label>
        <input
          name={langObj.language}
          type="checkbox"
          // checked={}
          onChange={handleChecks} 
        /> 
        {langObj.language}
      </label>
    )
  })
}

export default ScatterPlotSelection