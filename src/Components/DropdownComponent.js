import React from 'react'
import { Dropdown } from "react-bootstrap";

function DropdownComponent(props){

  return Object.entries(props.options).map(pairArr => 
    <Dropdown.Item key={pairArr[0]} eventKey={pairArr[0]} >
      {pairArr[1]}
    </Dropdown.Item>
  )

}
  


export default DropdownComponent