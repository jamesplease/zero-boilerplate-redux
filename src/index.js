import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './components/App';
import Gists from './components/Gists';
import Gist from './components/Gist';
import NewGist from './components/NewGist';
import store from './state/store';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route
        path="/"
        render={({ location }) => (
          <App location={location}>
            <Switch>
              <Route exact path="/" component={Gists} />
              <Route exact path="/new" component={NewGist} />
              <Route exact path="/:gistId" component={Gist} />
            </Switch>
          </App>
        )}
      />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
