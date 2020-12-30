import {Container, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {populations} from "../utils";
import React from "react";


function PopulationToggle({handleToggle}){
    return(
                <ToggleButtonGroup type="radio" name="human-type" defaultValue={populations.GTE_ONE_SITELINK} onChange={handleToggle}>
                    <ToggleButton value={populations.ALL_WIKIDATA} name="all" size="lg" variant="outline-dark">All Humans on
                        Wikidata</ToggleButton>
                    <ToggleButton value={populations.GTE_ONE_SITELINK} name="at-least-one" size="lg" variant="outline-dark">Humans
                        With At Least One Wikipedia Article</ToggleButton>
                </ToggleButtonGroup>
        )
}
export default PopulationToggle