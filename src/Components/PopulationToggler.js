import React from "react";
import Nav from "react-bootstrap/Nav";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { populations } from "../utils";
import InfoCircle from "./Icons/InfoCircle";

function PopulationToggle({ handleToggle, GTE_ONLY }) {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Data imported from Wikidata with items that have human property
    </Tooltip>
  );

  const renderAtLeastTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Data imported from Wikidata with items that have human property and at
      least one sitelink
    </Tooltip>
  );

  return (
    <Nav
      justify
      variant="tabs"
      defaultActiveKey={populations.GTE_ONE_SITELINK}
      onSelect={handleToggle}
    >
      <Nav.Item>
        <OverlayTrigger
          key={"bottom"}
          placement={"bottom"}
          overlay={renderTooltip}
        >
          <Nav.Link eventKey={populations.ALL_WIKIDATA}>
            <div className="flex">
              <p className="one-article">All Humans on Wikidata</p>
              <div className="info-div-toggler">
                <InfoCircle />
              </div>
            </div>
          </Nav.Link>
        </OverlayTrigger>
      </Nav.Item>
      <Nav.Item>
        <OverlayTrigger
          key={"bottom"}
          placement={"bottom"}
          overlay={renderAtLeastTooltip}
        >
          <Nav.Link eventKey={populations.GTE_ONE_SITELINK}>
            <div className="flex">
              <p className="one-article">
                Humans With At Least One Wikipedia Article
              </p>
              <div className="info-div-toggler">
                <InfoCircle />
              </div>
            </div>
          </Nav.Link>
        </OverlayTrigger>
      </Nav.Item>
    </Nav>
  );
}

export default PopulationToggle;
