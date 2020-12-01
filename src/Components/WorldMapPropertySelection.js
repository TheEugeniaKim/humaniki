import React from 'react'


function WorldMapPropertySelection(props){  
  return props.options.map((option,index) => 
    <option value={option} key={index}>{option}</option>
  )
}

export default WorldMapPropertySelection