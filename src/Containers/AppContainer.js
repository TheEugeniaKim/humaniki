import React, { useState, useEffect } from 'react'
import NavBarComponent from '../Components/NavBarComponent'
import Footer from '../Components/Footer'
import DefaultView from '../Views/DefaultView'
import AboutView from '../Views/AboutView'
import AdvancedSearchView from '../Views/AdvancedSearchView'
import GenderByCountryView from '../Views/GenderByCountryView'
import GenderByDOBView from '../Views/GenderByDOBView'
import GenderByLanguageView from '../Views/GenderByLanguageView'
import { Container } from 'react-bootstrap'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'

function AppContainer() {
  const [navBar, setNavBar] = useState("about")

  return (
    <div className="App" >
      <NavBarComponent setNavBar={setNavBar} />
      <Router>
        <Route exact path={"/"} render={() => <DefaultView/>} />
        <Route exact path={"/about"} render={() => <AboutView/>} />
        <Route exact path={"/advanced-search"} render={() => <AdvancedSearchView />}  />
        <Route exact path={"/gender-by-country"} render={() => <GenderByCountryView />}  />
        <Route exact path={"/gender-by-dob"} render={() => <GenderByDOBView />}  />
        <Route exact path={"/gender-by-language"} render={() => <GenderByLanguageView />}  />
      </Router>
      <Container>
        <Footer className="fixed-bottom" />
      </Container>
    </div>
  );
}

export default AppContainer;
