import React, {useState, useEffect} from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import DateFilterIcon from './DateFilterIcon';
import QuestionIcon from './QuesionIcon';
import ZoomInIcon from './ZoomInIcon'

function HoverTooltip({view}){
  const [message, makeMessage] = useState(null) 
  const [icon, makeIcon] = useState(null)
  useEffect(() => {
    if (view === "country"){
      makeMessage("Use mouse scroll to zoom in and out")
    } else if (view === "dob"){
      makeMessage("Enter Year Range filters (Format YYYY) to get detailed graph")
    } else if (view === "language"){
      makeMessage("Hover over data points to get more information")
    }

    if (view === "country"){
      makeIcon(<ZoomInIcon />)
    } else if (view === "dob"){
      makeIcon(<DateFilterIcon />)
    } else if (view === "language"){
      makeIcon(<QuestionIcon />)
    }
    
  },[view])


  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {message}
    </Tooltip>
  )
  
  return (
    <OverlayTrigger
      key="right"
      placement="right"
      overlay={renderTooltip}
    >
      <div>
        {icon}
      </div>
    </OverlayTrigger>
  )
}

export default HoverTooltip