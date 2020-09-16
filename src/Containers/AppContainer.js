import React, { useState, useEffect } from 'react'
import DataContainer from '../Containers/DataContainer'
import NavBarComponent from '../Components/NavBarComponent'
import AboutPage from '../Components/AboutPage'
import Footer from '../Components/Footer'
import GenderByCountryView from '../Views/GenderByCountryView'
import GenderByDOBView from '../Views/GenderByDOBView'
import GenderByLanguage from '../Views/GenderByLanguageView'

function App() {
  const [navBar, setNavBar] = useState("about")

  return (
    <div className="App">
      <NavBarComponent setNavBar={setNavBar} />
      Nav Bar Selected: {navBar}

      {navBar === "about" ? <AboutPage /> : null}
      {navBar === "advanced-search" ? <DataContainer /> : null}
      {navBar === "gender-by-country" ? <GenderByCountryView /> : null}
      {navBar === "gender-by-DOB" ? <GenderByDOBView /> : null}      
      <br />
      <Footer />
    </div>
  );
}

export default App;
