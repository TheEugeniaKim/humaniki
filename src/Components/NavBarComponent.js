import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import humanikiLogo from "../assets/humaniki.png";
import HoverTooltip from "./HoverTooltip";

function NavBarComponent() {
  return (
    <React.Fragment>
      <Navbar collapseOnSelect bg="light" expand="lg">
        <div className={"navbar-brand-group"}>
          <Navbar.Brand href="/">
            <img className="nav-logo" src={humanikiLogo} alt="humaniki-logo" />
          </Navbar.Brand>
          <Navbar.Brand id="alpha-tooltip">
            <HoverTooltip view="alpha" />
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/search">Search</Nav.Link>
            <NavDropdown title="Visualizations" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/gender-by-country">
                Gender By Country
              </NavDropdown.Item>
              <NavDropdown.Item href="/gender-by-dob">
                Gender By Year of Birth
              </NavDropdown.Item>
              <NavDropdown.Item href="/gender-by-language">
                Gender By Language
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              href="https://www.mediawiki.org/wiki/Humaniki/FAQ"
              target="_blank"
            >
              FAQ
            </Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </React.Fragment>
  );
}

export default NavBarComponent;
