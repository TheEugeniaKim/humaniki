import React from 'react'
import ccLogo from '../assets/cc-logo.png'

function Licensing(){
  return (
    <div className="licensing">
      Source: humanikidata.org powered by Wikidata 
      <br/>
      <img src={ccLogo} alt="creative commons logo" className="cc-logo"></img>
      This chart is available under the Creative Commons 
      Attribution-ShareAlike 4.0 International License
    </div>
  )
}

export default Licensing 