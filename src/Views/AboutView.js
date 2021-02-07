import React from 'react'
import { Container } from 'react-bootstrap'
import "../App.css"
import "../Sk.css"
import mkImage from "../assets/team/mk.png"
import skImage from "../assets/team/sk.png"
import ekImage from "../assets/team/ek.png"
import ehImage from "../assets/team/eh.png"

function AboutView(){

  return (
    <div className="about-main">
      <div className="about-header sub-container">
        <h4>We create awareness about content diversity in online knowledge spaces </h4>
        <figure>
          <img 
            className="about-img"
            src="./politiciansGenderGap.png" 
            alt="world leaders walking and talking from the 37th G8 summit" 
          />
          <figcaption>World leaders</figcaption>
        </figure>  
      </div>
      <div className="about-content sub-container">
        <h5> About Humaniki </h5>
        <p>
          Humaniki is a project producing a open data set about the gender, date of birth, place of birth, 
           and language of biography articles in all Wikipedias and content of all Wikimedia projects. Our data set comes from Wikidata, the 
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
      <div className="about-api sub-container">
        <h5> Get started with data exploration with Humaniki API </h5>
        <p>
          loren ipsum
        </p>
      </div>
      <div className="about-team-1 sub-container">
        <h5> Meet our Team (Option 1) </h5>
        <div className="row-team">
          <div className ="col-team">
            <a href="https://www.sejalkhatri.com/" target="_blank">
              <p className="team-name"> Maximilian Klein </p>
              <p className="team-title"> Project Manager and Software Lead </p>
              <p className="team-founder"> Founder </p>
            </a>
          </div>
          <div className ="col-team">
            <a href="https://www.sejalkhatri.com/" target="_blank">
              <p className="team-name"> Envel Le Hir </p>
              <p className="team-title"> Data Engineer </p>
              <p className="team-founder"> Founder </p>
            </a>
          </div>
          <div className ="col-team">
            <a href="https://www.sejalkhatri.com/" target="_blank">        
              <p className="team-name"> Eugenia Kim </p>
              <p className="team-title"> Frontend Engineer </p>
              <p className="team-founder">  </p>
            </a>
          </div>
          <div className ="col-team">
            <a href="https://www.sejalkhatri.com/" target="_blank">
              <p className="team-name"> Sejal Khatri </p>
              <p className="team-title"> UX Researcher and Designer </p>
              <p className="team-founder">  </p>
            </a>
          </div>
        <div className="about-team-more"> 
          <a href="https://diff.wikimedia.org/2020/09/15/humaniki-wikimedia-diversity-data-tools/" target="_blank"> Learn more </a> 
        </div>
        </div>
      </div>
      <div className="about-team-2 sub-container">
        <h5> Meet our Team (Option 2) </h5>
        <div className="row-team">
          <div className ="col-team">
            <a href="https://www.sejalkhatri.com/" target="_blank">
              <img 
                className="col-team-img"
                src={mkImage}
                alt="Image of Maximilian Klein" 
              />
              <p className="team-name"> Maximilian Klein </p>
              <p className="team-title"> Project Manager and Software Lead </p>
              <p className="team-founder"> Founder </p>
            </a>
          </div>
          <div className ="col-team">
            <a href="https://www.sejalkhatri.com/" target="_blank">
              <img 
                className="col-team-img"
                src={ehImage}
                alt="Image of Envel Le Hir" 
              />
              <p className="team-name"> Envel Le Hir </p>
              <p className="team-title"> Data Engineer </p>
              <p className="team-founder"> Founder </p>
            </a>
          </div>
          <div className ="col-team">
            <a href="https://www.sejalkhatri.com/" target="_blank">
              <img 
                className="col-team-img"
                src={ekImage}
                alt="Image of Eugenia Kim" 
              />
              <p className="team-name"> Eugenia Kim </p>
              <p className="team-title"> Frontend Engineer </p>
              <p className="team-founder">  </p>
            </a>
          </div>
          <div className ="col-team">
            <a href="https://www.sejalkhatri.com/" target="_blank">
              <img 
                className="col-team-img"
                src={skImage}
                alt="Image of Sejal Khatri" 
              />     
              <p className="team-name"> Sejal Khatri </p>
              <p className="team-title"> UX Researcher and Designer </p>
              <p className="team-founder">  </p>
            </a>
          </div>
          <div className="about-team-more"> 
            <a href="https://diff.wikimedia.org/2020/09/15/humaniki-wikimedia-diversity-data-tools/" target="_blank"> Learn more </a> 
          </div>
        </div>
      </div>
      <div className="about-contact sub-container">
        <h5> Contact Us </h5>
        <p>
          <a href="mailto:humanikidata@gmail.com" target="_blank"> humanikidata@gmail.com </a>  |  <a href="https://twitter.com/humanikiData" target="_blank"> Twitter: @humanikiData </a>
        </p>
      </div>
    </div>
  )
}

export default AboutView 