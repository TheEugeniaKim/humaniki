import React, { useState, useEffect, useRef } from 'react'
import { select, scaleLinear} from 'd3'
import { Container } from 'react-bootstrap'
import "../App.css"
import "../Sk.css"

function AboutView(){

  return (
    <Container className="About">
      <div className="About-Content">
        <h2>We create awareness about content diversity in online knowledge spaces </h2>
        <img 
          className="about-img"
          src="./politiciansGenderGap.png" 
          alt="world leaders walking and talking from the 37th G8 summit" 
        ></img>        
        <h5>The World Leaders</h5>
        
        <p>
          WHGI is a project producing a open data set about the gender, date of birth, place of birth, ethnicity, 
          occupation, and language of biography articles in all Wikipedias. Our data set comes from Wikidata, the 
          database the feeds Wikipedia, and is updated weekly. This site shows a few demonstrations of what can be 
          done with that information.
        </p>

        <p>
          Read the paper  'Gender gap through time and space: A journey through Wikipedia 
          biographies via the Wikidata Human Gender Indicator', from New Media and Society, which presents validations 
          of WHGI against three exogenous datasets: the world’s historical population, “traditional” gender-disparity 
          indices (GDI, GEI, GGGI and SIGI), and occupational gender according to the US Bureau of Labor Statistics. 
          Plus demonstrations of how the Wikimedia community can use it, and research in general.
        </p>

        <p>
          A note to Wikipedians: 
          this data relies entirely on Wikidata, so if you would like your work to in writing biographies to be reflected 
          here please make sure Wikidata knows that your article is about a human and has an associated gender.
        </p>

        <p>
          This project started as a personal research interest, and is now funded by a Wikimedia Foundation Grant.
        </p>
      </div>
    </Container>
  )
}

export default AboutView 