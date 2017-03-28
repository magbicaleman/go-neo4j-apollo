import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Attendees from './scenes/Attendees';
import AddAttendee from './scenes/Attendees/Add';
import { Route, Link } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <AddAttendee />
        <Attendees />
      </div>
    );
  }
}

export default App;
