import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ZoomInIcon from './ZoomInIcon';

function ZoomHover(){
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Use mouse scroll to zoom in and out
    </Tooltip>
  )
  
  return (
    <OverlayTrigger
      key="right"
      placement="right"
      overlay={renderTooltip}
    >
      <div className="zoom-icon">
        <ZoomInIcon />
      </div>
    </OverlayTrigger>
  )
}

export default ZoomHover