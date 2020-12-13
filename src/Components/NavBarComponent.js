import React from 'react'
import  {Navbar, Nav}  from 'react-bootstrap'

function NavBarComponent (props){
  return (
    <React.Fragment>
      <Navbar bg="light" variant="light" sticky="top">
        <Navbar.Brand href="/" >
          <img className="nav-logo" src="./humaniki.png" alt="humaniki-logo"/>
        </Navbar.Brand>
        <Nav className="justify-content-end">
          <Nav.Link  href="/about" >About</Nav.Link>
          <Nav.Link  href="/advanced-search">Advanced Search</Nav.Link>
          <Nav.Link  href="/gender-by-country">Gender By Country</Nav.Link>
          <Nav.Link  href="/gender-by-dob" >Gender By Date of Birth</Nav.Link>
          <Nav.Link  href="/gender-by-language" >Gender By Language</Nav.Link>
          <Nav.Link  href="/documentation">Documentation</Nav.Link>
        </Nav>
      </Navbar>
    </React.Fragment>
  )
}

export default NavBarComponent;
