import React, { useState, useEffect } from 'react'
import NavBarComponent from '../Components/NavBarComponent'
import AboutPage from '../Components/AboutPage'
import Footer from '../Components/Footer'
import AdvancedSearchView from '../Views/AdvancedSearchView'
import GenderByCountryView from '../Views/GenderByCountryView'
import GenderByDOBView from '../Views/GenderByDOBView'
import GenderByLanguageView from '../Views/GenderByLanguageView'

function AppContainer() {
  const [navBar, setNavBar] = useState("about")

  return (
    <div className="App">
      <NavBarComponent setNavBar={setNavBar} />
      {navBar === "about" ? <AboutPage /> : null}
      {navBar === "advanced-search" ? <AdvancedSearchView /> : null}
      {navBar === "gender-by-country" ? <GenderByCountryView /> : null}
      {navBar === "gender-by-DOB" ? <GenderByDOBView /> : null}  
      {navBar === "language" ? <GenderByLanguageView /> : null}  
      <br />
      <Footer />
    </div>
  );
}

export default AppContainer;
