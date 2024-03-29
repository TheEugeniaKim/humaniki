import React from "react";

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="list-container list-documentation">
          <h6> Documentation </h6>
          <ul>
            <li>
              <a href="/about">About Humaniki</a>
            </li>
            <li>
              <a
                href="https://www.mediawiki.org/wiki/Humaniki/FAQ#What_is_the_roadmap?"
                target="_blank"
                rel="noopener noreferrer"
              >
                Humaniki Roadmap
              </a>
            </li>
            <li>
              <a
                href="https://www.mediawiki.org/wiki/Humaniki/FAQ#What_data_it_uses?"
                target="_blank"
                rel="noopener noreferrer"
              >
                Data it uses
              </a>
            </li>
            <li>
              <a
                href="https://www.mediawiki.org/wiki/Humaniki/FAQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                FAQ
              </a>
            </li>
          </ul>
        </div>
        <div className="list-container list-contributing">
          <h6> Contributing </h6>
          <ul>
            <li>
              <a
                href="https://github.com/TheEugeniaKim/humaniki/blob/master/docs/CONTRIBUTION_GUIDE.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contribution guide
              </a>
            </li>
            <li>
              <a
                href="https://phabricator.wikimedia.org/maniphest/task/edit/form/59/?title=Humaniki%20Bug&projectPHIDs=Humaniki"
                target="_blank"
                rel="noopener noreferrer"
              >
                Report a bug
              </a>
            </li>
            <li>
              <a
                href="https://phabricator.wikimedia.org/maniphest/task/edit/form/56/?title=Humaniki%20New%20Feature&projectPHIDs=Humaniki"
                target="_blank"
                rel="noopener noreferrer"
              >
                Request a Feature
              </a>
            </li>
          </ul>
        </div>
        <div className="list-container list-community">
          <h6> Community </h6>
          <ul>
            <li>
              <a
                href="https://phabricator.wikimedia.org/project/board/4967/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Phabricator
              </a>
            </li>
            <li>
              <a
                href="https://github.com/TheEugeniaKim/humaniki/blob/master/docs/CONTRIBUTION_GUIDE.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
            </li>
            <li>
              <a href="https://twitter.com/humanikiData" 
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-copyright">
        <p>
          All data, charts, and other content is available under the{" "}
          <b> Creative Commons Attribution-ShareAlike 3.0 </b> International
          License.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
