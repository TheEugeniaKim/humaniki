import React, { useState, useEffect } from 'react'
import NavBarComponent from '../Components/NavBarComponent'
import Footer from '../Components/Footer'
import DefaultView from '../Views/DefaultView'
import AboutView from '../Views/AboutView'
import GenderByCountryView from '../Views/GenderByCountryView'
import GenderByDOBView from '../Views/GenderByDOBView'
import GenderByLanguageView from '../Views/GenderByLanguageView'
import CombineSearch from '../Views/CombineSearch'
import ErrorLoadingView from '../Views/ErrorLoadingView'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import humanikiAPI from '../comm'
import { Container } from 'react-bootstrap'

const API = new humanikiAPI()

function AppContainer() {
  const [navBar, setNavBar] = useState("about")
  const [snapshots, setSnapshots] = useState(null)

  useEffect(() => {
    API.saveSnapshots((snapshotData) => setSnapshots(snapshotData))
  }, [])

  return (
    <Container className="App">
      <ToastContainer /> 
      <NavBarComponent setNavBar={setNavBar}/>
      <Router>
        <Route exact path={"/"} render={() => 
          <DefaultView 
            API={API}  
          />
        }/>
        <Route exact path={"/about"} render={() => 
          <AboutView 
            API={API} 
          /> 
        }/>
        <Route exact path={"/combine-search"} render={() => 
          <CombineSearch 
            API={API} 
            snapshots={snapshots ? snapshots : null} 
          />
        } />
        <Route exact path={"/gender-by-country"} render={() => 
          <GenderByCountryView 
            API={API} 
            snapshots={snapshots ? snapshots : null} 
          />
        }/>
        <Route exact path={"/gender-by-dob"} render={() => 
          <GenderByDOBView 
            API={API} 
            snapshots={snapshots ? snapshots : null} 
          />
        }/>
        <Route exact path={"/gender-by-language"} render={() => 
          <GenderByLanguageView 
            API={API} 
            snapshots={snapshots ? snapshots : null} 
          />
        }/>
        <Route exact path={"/error-test"} render={() => 
          <ErrorLoadingView
            API={API} 
          />
        }/>
      </Router>
      <Footer />
    </Container>
  )
}

export default AppContainer;
