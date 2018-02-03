import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import gists from './gists';

// Redux Resource works best in conjunction with `combineReducers`.
// Although this project only has one resource, `gists`, using
// `combineReducers` allows you to add more resources as needed.
// For more, see the he documentation for `combineReducers`:
// http://redux.js.org/docs/api/combineReducers.html
const reducer = combineReducers({
  gists
});

// We set up Redux Devtools, just in case
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  reducer,
  // We use the redux-thunk middleware to support making asynchronous
  // requests in our action creators. Note that you can use any system
  // for side-effects that you'd like: redux-thunk, redux-saga,
  // redux-observable – any library works!
  //
  // For more on redux-thunk, refer to the documentation:
  // https://github.com/gaearon/redux-thunk
  composeEnhancers(applyMiddleware(thunk))
);
