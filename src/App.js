import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBarComponent from './Components/NavBarComponent'

function App() {
  const [navBar, setNavBar] = useState("about")

  

  return (
    <div className="App">
      <NavBarComponent setNavBar={setNavBar} />
      Nav Bar Selected: {navBar}
      {/* <AppContainer navBar={navBar} /> */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
