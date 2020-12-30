import React, { Component } from 'react'
import $ from 'jquery'
import Popper from 'popper.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './App.css';
import './Sk.css';
import AppContainer from './Containers/AppContainer'

class App extends Component {
  render(){
    return (
      <div className="App"> 
        <AppContainer />
      </div>
    )
  }
}

export default App;
