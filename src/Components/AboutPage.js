import React, { useState, useEffect } from 'react'
import "../App.css"
import DataContainer from '../Containers/DataContainer'

function AboutPage(){


  return (
    <div className="About">
      <div className="About-Content">
        <h1>Explore Gender Diversity on Wikipedia Biographies with humaniki </h1>
        <h3>
          Humaniki is a project producing a open data set about the gender, 
          date of birth, place of birth, occupation, and language of biography articles 
          in all Wikipedias.
        </h3>
      </div>
      
      <div className="About-DataContainer">
        <h4>Recent Distribution of Articles</h4>

        <svg></svg>

      </div>

      <p>
        Expore further dynames of the gender gap in bibliographic content on Wikipedia
        with Humaniki and learn how you can contribute to bridge this gap. Compare gender 
        diversity across Wikipedia language editions, gender by country, and date of birth. 
      </p>
    </div>
  )
}

export default AboutPage 