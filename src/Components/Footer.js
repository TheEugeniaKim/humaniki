import React from 'react'
import  {Navbar}  from 'react-bootstrap'

function Footer(){
  return (
    <footer>
   		<div className="footer-container">
 	 		<div className="list-container list-documentation">
 	 			<h5> Documentation </h5> 
 	 			<ul> 
 	 				<li><a href="">About Humaniki</a></li>
 	 				<li><a href="">Humaniki API</a></li>
 	 				<li><a href="">Data it uses</a></li>
 	 				<li><a href="https://www.mediawiki.org/wiki/Humaniki/FAQ" target="_blank">FAQ</a></li>
 	 			</ul>
 	 		</div>
 	 		<div className="list-container list-contributing">
 	 			<h5> Contributing </h5> 
 	 			<ul> 
 	 				<li><a href="">Contributing guide</a></li>
 	 				<li><a href="">Report a bug</a></li>
 	 				<li><a href="">Request a Feature</a></li>
 	 				
 	 			</ul>
 	 		</div>
 	 		<div className="list-container list-community">
 	 			<h5> Community </h5> 
  	 			<ul> 
 	 				<li><a href="https://phabricator.wikimedia.org/project/profile/4967/" target="_blank">Phabricator</a></li>
 	 				<li><a href="">Github</a></li>
 	 				<li><a href="">IRC</a></li>
 	 				<li><a href="https://twitter.com/humanikiData" target="_blank">Twitter</a></li>
 	 			</ul>
 	 		</div>
		</div> 
		<div className="footer-copyright">
      		<p>All data, charts, and other content is available under the <b> Creative Commons Attribution-ShareAlike 4.0 </b> International License.</p>
      	</div>
	</footer>
  )
}

export default Footer; 