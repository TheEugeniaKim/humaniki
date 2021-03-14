import React from "react";
import ccLogo from "../assets/cc-logo.png";

function Licensing() {
  return (
    <div className="licensing">
      Source: humanikidata.org powered by{" "}
      <a
        href="https://www.wikidata.org/wiki/Wikidata:Main_Page"
        target="_blank"
      >
        {" "}
        Wikidata{" "}
      </a>
      <br />
      <img
        src={ccLogo}
        alt="creative commons logo"
        className="cc-logo"
      ></img>{" "}
      <span> </span>
      This chart is available under the Creative Commons Attribution-ShareAlike
      3.0 International License
    </div>
  );
}

export default Licensing;
