import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import NavItem from 'react-bootstrap/NavItem'

function NavBarComponent ({setNavBar}){
  return (
    <React.Fragment>
      <Navbar collapseOnSelect bg="light" onSelect={setNavBar}>
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav"> */}
          {/* <Navbar.Header> */}
            <Navbar.Brand href="/" >
              <img className="nav-logo" src="./humaniki.png" alt="humaniki-logo"/>
            </Navbar.Brand>
          {/* </Navbar.Header> */}
          <Nav className="mr-auto justify-content-end" >
            <Nav.Link href="/about">About</Nav.Link>
              <NavDropdown title="Vizualizations" id="nav-dropdown" >
                <NavDropdown.Item href="/gender-by-country">Gender By Country</NavDropdown.Item>
                <NavDropdown.Item href="/gender-by-dob" >Gender By Date of Birth</NavDropdown.Item>
                <NavDropdown.Item href="/gender-by-language" >Gender By Language</NavDropdown.Item>
              </NavDropdown>
            <Nav.Link  href="/combine-search">Combine Search</Nav.Link>
            <Nav.Link  href="/faq">FAQ</Nav.Link>           
          </Nav>
       {/* </Navbar.Collapse> */}
     </Navbar>
    </React.Fragment>
  )
}

export default NavBarComponent;
