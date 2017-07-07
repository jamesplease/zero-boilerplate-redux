import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import { Route, Switch } from 'react-router-dom';
import './index.css';
import App from './components/App';
import Gists from './components/Gists';
import Gist from './components/Gist';
import CreateGist from './components/CreateGist';
import registerServiceWorker from './registerServiceWorker';
import store from './state/store';

const history = createBrowserHistory();

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" render={({ location }) => (
        <App location={location}>
          <Switch>
            <Route exact path="/" component={Gists}/>
            <Route exact path="/new" component={CreateGist}/>
            <Route exact path="/:gistId" component={Gist}/>
          </Switch>
        </App>
      )}/>
    </Router>
  </Provider>
), document.getElementById('root'));
registerServiceWorker();
