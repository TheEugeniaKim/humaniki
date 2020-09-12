import React, { useState } from 'react'
import  {Navbar, Nav}  from 'react-bootstrap'

// import humaniki from '../humaniki.png'

function NavBarComponent (props){
  function handleAboutClick() {
    props.setNavBar("about")
  }

  // function handleEvolutionClick() {
  //   props.setNavBar("evolution")
  // }

  function handleAdvancedSearchClick(){
    props.setNavBar("advanced-search")
  }

  function handleCountryClick(){
    props.setNavBar("gender-by-country")
  }

  function handleDOBClick(){
    props.setNavBar("gender-by-DOB")
  }

  function handleLanguageClick(){
    props.setNavBar("language")
  }

  function handleDocumentationClick() {
    props.setNavBar("documentation")
  }
  return (
    <React.Fragment>
        <Navbar bg="light" variant="light" sticky="top">
          <Navbar.Brand href="#About" >
            <img className="nav-logo" src="./humaniki.png" alt="humaniki-logo"/> 
          </Navbar.Brand>
          <Nav className="justify-content-end">
            <Nav.Link onClick={handleAboutClick} href="#About" >About</Nav.Link>
            {/* <Nav.Link onClick={handleEvolutionClick} href="#Evolution" >Evolution</Nav.Link> */}
            <Nav.Link onClick={handleAdvancedSearchClick} href="#Advanced-Search">Advanced Search</Nav.Link>
            <Nav.Link onClick={handleCountryClick} href="#Gender-By-Country">Gender By Country</Nav.Link>
            <Nav.Link onClick={handleDOBClick} href="#Gender-By-DOB" >Gender By Date of Birth</Nav.Link>
            <Nav.Link onClick={handleLanguageClick} href="#Gender-By-Language" >Gender By Language</Nav.Link>
            <Nav.Link onClick={handleDocumentationClick} href="#Documentation">Documentation</Nav.Link>
          </Nav>
        </Navbar>
    </React.Fragment>
  )
}

export default NavBarComponent; 