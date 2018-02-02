import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import login from '../personal-access-token';
import { ReadGist } from '../request-components/Gist';

const isLoggedIn = Boolean(login.username && login.token);

class App extends Component {
  render() {
    const { children } = this.props;

    return (
      <div className="App">
        <div className="App-header">
          <h2>
            <Link to="/" className="App-headerLink">
              Gists
            </Link>
          </h2>
          <Link to="/new" className="App-createGistLink">
            New Gist
          </Link>
        </div>
        {!isLoggedIn &&
          `Please provide a GitHub Personal Access Token to use this application.
          For more, refer to this project's documentation on GitHub.`}
        {isLoggedIn && (
          <ReadGist gistId="a6396779d28ed91eb1a55d54a5d228c9">
            {stuff => {
              console.log('the stuff', stuff);
              return <div>Got it</div>;
            }}
          </ReadGist>
        )}
      </div>
    );
  }
}

export default App;
