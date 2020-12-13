import React from 'react'

function ScatterPlotSelection(props){
  console.log("Scatter section", props.data)

  function handleChecks(e){
    console.log(e.target.value)
  }

  
  return props.data.map(langObj => {
    return (
      <div>
        <label>
          <input
            name={langObj.language}
            type="checkbox"
            onChange={handleChecks} 
          /> 
          {langObj.language}
        </label>
        <br/>
      </div>
    )
  })
}

export default ScatterPlotSelection