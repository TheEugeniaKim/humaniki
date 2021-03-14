import React, {useState, useEffect} from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import DateFilterIcon from './DateFilterIcon';
import QuestionIcon from './QuestionIcon';
import ZoomInIcon from './ZoomInIcon';
import InfoCircle from './InfoCircle';


function HoverTooltip({view}){
  const [message, makeMessage] = useState(null) 
  const [icon, makeIcon] = useState(null)
  useEffect(() => {
    if (view === "country"){
      makeMessage("Use mouse scroll to zoom in and out")
    } else if (view === "dob"){
      makeMessage("Enter Year Range filters (Format YYYY) to adjust scope.")
    } else if (view === "language"){
      makeMessage("Top 10 wikimedia projects by number of humans are shown by default, add data point in to create your own scatterplot. Hover over data points to get more information.")
    } else if (view === "gender-female-male"){
      makeMessage("Gender label is representative of gender data labelling on Wikidata.")
    } else if (view === "gender-sum-others"){
      makeMessage("Sum of all genders that are not set as male or female in Wikidata (use Other Genders Breakdown to inspect).")
    } else if (view === "alpha"){
      makeMessage("This is an incomplete alpha-release. Please see FAQ in footer to view roadmap and report bugs.")
      makeIcon('α')
    }

    //TODO inline this switch with above switch
    if (view === "country"){
      makeIcon(<ZoomInIcon />)
    } else if (view === "dob"){
      makeIcon(<DateFilterIcon />)
    } else if (view === "language"){
      makeIcon(<QuestionIcon />)
    } else if (view === "gender-female-male"){
      makeIcon(<InfoCircle id="column-info-icon" />)
    } else if (view === "gender-sum-others"){
      makeIcon(<InfoCircle id="column-info-icon" />)
    } else if (view === "alpha"){
      makeMessage("This is an incomplete alpha-release. Please see FAQ in footer to view roadmap and report bugs.")
    }
    
  },[view])


  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {message}
    </Tooltip>
  )
  
  return (
    <OverlayTrigger
      key="bottom"
      placement="bottom"
      overlay={renderTooltip}
    >
      <div className="icon">
        {icon}
      </div>
    </OverlayTrigger>
  )
}

export default HoverTooltip