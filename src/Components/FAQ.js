import React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

function FAQ(){

  return (
    <div id="faq">
    	<h2> FAQ </h2>
		<Accordion defaultActiveKey="0">
		  <Card>
		    <Card.Header>
		      <Accordion.Toggle as={Button} variant="link" eventKey="0">
		        What is humaniki?
		      </Accordion.Toggle>
		    </Card.Header>
		    <Accordion.Collapse eventKey="0">
		      <Card.Body>Humaniki provides statistics about the gender gap in the content of all Wikimedia projects based on data available on Wikidata. The data is available under the creative commons license and is free for anyone to use!</Card.Body>
		    </Accordion.Collapse>
		  </Card>
		  <Card>
		    <Card.Header>
		      <Accordion.Toggle as={Button} variant="link" eventKey="1">
		        Why humaniki doesn’t reflect editing I did yesterday?
		      </Accordion.Toggle>
		    </Card.Header>
		    <Accordion.Collapse eventKey="1">
		      <Card.Body>Although it would be useful the queries that WHGI runs are too large for community SQL/SPARQL services. Instead to compute the statistics WHGI downloads the entire Wikidata dump and parses it with Wikidata Toolkit. That is, say for instance a dump file that is created by Wikidata on March 5th, it might only be reflecting the latest data up to March 4th. WHGI runs every day midnight, so it's actually getting a Wikidata Dump that's maybe a day-or-two out of date. So even if you did something on March 5th and WHGI runs on March 5th, because of the dump latency it's possible it won't show up in time. We bet if you check back after 24 hrs you might see the results you were expecting.</Card.Body>
		    </Accordion.Collapse>
		  </Card>
		  <Card>
		    <Card.Header>
		      <Accordion.Toggle as={Button} variant="link" eventKey="2">
		        What data it uses?
		      </Accordion.Toggle>
		    </Card.Header>
		    <Accordion.Collapse eventKey="2">
		      <Card.Body>Humaniki uses Wikidata, the centralized knowledge base of Wikimedia projects, to generate statistics. It only imports data that has properties associated with humans and not otherwise. <img className="about-img" src="../assets/about-view-graphic.png" alt="Humaniki Architecture"></img></Card.Body>
		    </Accordion.Collapse>
		  </Card>
		</Accordion>
    </div>
  )


}

export default FAQ