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
        <nav>
          <Link to='/'>Home</Link>
          <Link to='/add-attendee'>Add Attendee</Link>
        </nav>
        <Route exact path="/" component={ Attendees }/>
        <Route path="/add-attendee" component={AddAttendee}/>
      </div>
    );
  }
}

export default App;
