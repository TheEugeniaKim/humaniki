import React from 'react'
import  {Navbar}  from 'react-bootstrap'

function Footer(){
  return (
    <footer>
   		<div className="flex-container">
  			<div></div>
  			<div></div>
 	 		<section>
 	 			<h5> Documentation </h5> 
 	 			<ul> 
 	 				<li><a href="">About Humaniki</a></li>
 	 				<li><a href="">Humaniki API</a></li>
 	 				<li><a href="">FAQ</a></li>
 	 			</ul>
 	 		</section>
 	 		<section>
 	 			<h5> Contributing </h5> 
 	 			<ul> 
 	 				<li><a href="">Phabricator</a></li>
 	 				<li><a href="">Github</a></li>
 	 				<li><a href="">IRC</a></li>
 	 			</ul>
 	 		</section>
 	 		<section>
 	 			<h5> Others </h5> 
 	 			<ul> 
 	 				<li><a href="">Report a bug</a></li>
 	 				<li><a href="">Request a Feature</a></li>
 	 				<li><a href="">Follow us on Twitter</a></li>
 	 			</ul>
 	 		</section>
		</div> 
		<div className="footer-text">
      		<p>All data, charts, and other content is available under the <b> Creative Commons Attribution-ShareAlike 4.0 </b> International License.</p>
      	</div>
	</footer>
  )
}

export default Footer; 