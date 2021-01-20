import React from "react";
import Nav from 'react-bootstrap/Nav';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip'
import { populations } from "../utils";
import InfoCircle from '../Components/InfoCircle'

function PopulationToggle({ handleToggle, GTE_ONLY }) {

	const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			Data imported from Wikidata with items that have human property and at least one sitelink 
		</Tooltip>
	)
  
  return (
    <Nav justify variant="tabs" defaultActiveKey={populations.GTE_ONE_SITELINK} onSelect={handleToggle}>
        <Nav.Item >
					<OverlayTrigger
						key={"top"}
						placement={"top"}
						overlay={renderTooltip}
					>
						<Nav.Link eventKey={populations.ALL_WIKIDATA} >
							All Humans on Wikidata  
							<InfoCircle  />
						</Nav.Link>
					</OverlayTrigger>
        </Nav.Item>
        <Nav.Item>
					<OverlayTrigger
						key={"top"}
						placement={"top"}
						overlay={renderTooltip}
					>
            <Nav.Link eventKey={populations.GTE_ONE_SITELINK}>
                Humans With At Least One Wikipedia Article
                <InfoCircle />
            </Nav.Link>
					</OverlayTrigger>
        </Nav.Item>
    </Nav>
  );
}

export default PopulationToggle;
