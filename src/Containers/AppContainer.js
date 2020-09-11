import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavBarComponent from '../Components/NavBarComponent'
import AboutPage from '../Components/AboutPage'
import Footer from '../Components/Footer'

function App() {
  const [navBar, setNavBar] = useState("about")


  return (
    <div className="App">
      <NavBarComponent setNavBar={setNavBar} />
      Nav Bar Selected: {navBar}

      { navBar === "about" ? <AboutPage /> : null}
      <br />
      <Footer />
    </div>
  );
}

export default App;
