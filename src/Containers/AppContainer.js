import React, { useState, useEffect } from 'react'
import NavBarComponent from '../Components/NavBarComponent'
import Footer from '../Components/Footer'
import AboutView from '../Views/AboutView'
import AdvancedSearchView from '../Views/AdvancedSearchView'
import GenderByCountryView from '../Views/GenderByCountryView'
import GenderByDOBView from '../Views/GenderByDOBView'
import GenderByLanguageView from '../Views/GenderByLanguageView'
import { Container } from 'react-bootstrap'

function AppContainer() {
  const [navBar, setNavBar] = useState("about")

  return (
    <div className="App" fluid>
      <NavBarComponent setNavBar={setNavBar} />
      {navBar === "about" ? <AboutView /> : null}
      {navBar === "advanced-search" ? <AdvancedSearchView /> : null}
      {navBar === "gender-by-country" ? <GenderByCountryView /> : null}
      {navBar === "gender-by-DOB" ? <GenderByDOBView /> : null}  
      {navBar === "language" ? <GenderByLanguageView /> : null}  
      <Footer className="fixed-bottom" />
    </div>
  );
}

export default AppContainer;
