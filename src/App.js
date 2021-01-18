import React, { Component } from 'react'
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
