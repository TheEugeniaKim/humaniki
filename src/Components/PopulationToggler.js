import React from "react";
import Nav from 'react-bootstrap/Nav';
import { populations } from "../utils";
import InfoCircle from '../Components/InfoCircle'

function PopulationToggle({ handleToggle, GTE_ONLY }) {
  return (
    <Nav justify variant="tabs" defaultActiveKey={populations.GTE_ONE_SITELINK} onSelect={handleToggle}>
        <Nav.Item >
            <Nav.Link eventKey={populations.ALL_WIKIDATA} >
                All Humans on Wikidata 
            </Nav.Link>
            {/* <InfoCircle /> */}
        </Nav.Item>
        <Nav.Item>
            <Nav.Link eventKey={populations.GTE_ONE_SITELINK}>
                Humans With At Least One Wikipedia Article
            </Nav.Link>
        </Nav.Item>
    </Nav>
  );
}

export default PopulationToggle;
