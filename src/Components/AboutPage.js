import React from 'react'
import DataContainer from '../Containers/DataContainer'

function AboutPage(){
  return (
    <div className="AboutContainer">

      <h1>Explore Gender Diversity on Wikipedia Biographies with humaniki </h1>
      <h3>
        Humaniki is a project producing a open data set about the gender, 
        date of birth, place of birth, occupation, and language of biography articles 
        in all Wikipedias.
      </h3>
      <div>
        <h3></h3>
      </div>
      <DataContainer />
    </div>
  )
}

export default AboutPage 