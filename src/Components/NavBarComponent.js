import React, {useState} from 'react'
import  {Navbar, Nav, NavDropdown, Item}  from 'react-bootstrap'


function NavBarComponent (props){
  const [isOpen, setIsOpen] = useState(false)
  return (
    <React.Fragment>
      <Navbar bg="light" variant="light" sticky="top" expand="lg">
        <Navbar.Brand href="/" >
          <img className="nav-logo" src="./humaniki.png" alt="humaniki-logo"/>
        </Navbar.Brand>
        <Nav className="justify-content-end">
          <Nav.Link  href="/about" >About</Nav.Link>
          {/* <NavDropdown title="Visualizations" id="collasible-nav-dropdown"> */}
            <NavDropdown.Item href="/gender-by-country">Gender By Country</NavDropdown.Item>
            <NavDropdown.Item href="/gender-by-dob" >Gender By Date of Birth</NavDropdown.Item>
            <NavDropdown.Item href="/gender-by-language" >Gender By Language</NavDropdown.Item>
          {/* </NavDropdown> */}
          <Nav.Link  href="/advanced-search">Advanced Search</Nav.Link>
          <Nav.Link  href="/documentation">Documentation</Nav.Link>
        </Nav>
      </Navbar>
    </React.Fragment>
  )
}

export default NavBarComponent;
