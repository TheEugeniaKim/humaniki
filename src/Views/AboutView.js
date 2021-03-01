import React from 'react'
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
      <div className="about-content">
        <h5> About Humaniki </h5>
        <p>
          Humaniki is a project producing an open data set about the gender, date of birth, place of birth, and language of content about humans in all Wikimedia projects, typically Wikipedia biography articles. Our data set comes from Wikidata, the database that feeds Wikipedia, and is updated daily. This site shows a few demonstrations of what can be done with the open API we've built to serve that information. 
        </p>

        <p>
          Humaniki  is a merger of two previous data diversity tools, <a href="https://whgi.wmflabs.org/" target="_blank">Wikidata Human Gender Indicators a.k.a WHGI</a> and <a href="https://denelezh.wmcloud.org/" target="_blank">Denelezh</a>, created by Maximillian Klein and Envel Le Hir respectively. Both of those previous sites were useful to the community, but as proof of concepts needed extra architectural work. It was decided that instead of improving each one, we would work together in the Wikimedian spirit of cooperation. 
        </p>

        <p>
          We have also conducted research about the significance of what Wikipedia's biography gap represents. That is, gender disparities in biographies mirror “traditional” gender-disparity indices (GDI, GEI, GGGI and SIGI), and occupational gender, although are most correlated to economic measurements.  Read our paper <a href="https://journals.sagepub.com/eprint/FCqs2m9JJxeN66dsTde9/full" target="_blank">'Gender gap through time and space: A journey through Wikipedia biographies via the Wikidata Human Gender Indicator'</a> for more.
        </p>

        <p>
          <div className= "note-text"> A NOTE TO WIKIPEDIANS: </div>
          This data relies entirely on Wikidata, so if you would like your work in writing biographies or other content about humans to be reflected here please make sure Wikidata knows that your article is about a human and has an associated gender. For more on contributing human data, see our <a href="https://www.mediawiki.org/wiki/Humaniki/FAQ" target="_blank">FAQ</a>. 
        </p>

        <p>
          This project started as a personal research interest, and is now funded by a Wikimedia Foundation Grant - <a href="https://meta.wikimedia.org/wiki/Grants:Project/Maximilianklein/humaniki" target="_blank">Link</a>.
        </p>
      </div>
      <div className="about-api sub-container">
        <h5> Get started with data exploration with Humaniki API </h5>
        <p>
          loren ipsum
        </p>
      </div>
      <div className="about-team sub-container">
        <h5> Meet our Team </h5>
        <div className="row-team">
          <div className ="col-team">
            <a href="https://notconfusing.com/" target="_blank">
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
            <a href="https://www.lehir.net/about/" target="_blank">
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
            <a href="https://www.linkedin.com/in/theeugeniakim/" target="_blank">
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
        <p> Email us: <a href="mailto:info@humanikidata.org" target="_blank"> info@humanikidata.org </a> </p> 
        <p> Check us out on Twitter: <a href="https://twitter.com/humanikiData" target="_blank"> @humanikiData </a>
        </p>
      </div>
    </div>
  )
}

export default AboutView 