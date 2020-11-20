import React, { Component } from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import AppContainer from './Containers/AppContainer'
import {Container} from 'react-bootstrap'
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
