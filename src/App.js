import React, { Component } from 'react';
import './App.css';
import Gists from './Gists';
import token from './personal-access-token';

const isLoggedIn = Boolean(token.username && token.token);

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Gists</h2>
        </div>
        {!isLoggedIn && ('Please provide a login.')}
        {isLoggedIn && (<Gists/>)}
      </div>
    );
  }
}

export default App;
