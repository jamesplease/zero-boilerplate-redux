import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import login from './personal-access-token';

const isLoggedIn = Boolean(login.username && login.token);

class App extends Component {
  render() {
    const { children } = this.props;

    return (
      <div className="App">
        <div className="App-header">
          <h2>
            <Link to="/">
              Gists
            </Link>
          </h2>
          <Link to="/new">
            New Gist
          </Link>
        </div>
        {!isLoggedIn && ('Please provide a login.')}
        {isLoggedIn && children}
      </div>
    );
  }
}

export default App;
