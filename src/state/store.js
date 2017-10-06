import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import gists from './gists/reducer';

// Redux Resource works best in conjunction with `combineReducers`.
// Although this project only has one resource, `gists`, using
// `combineReducers` allows you to add more resources as needed.
// The docs for `combineReducers` can be found here:
// http://redux.js.org/docs/api/combineReducers.html
const reducer = combineReducers({
  gists
});

export default createStore(
  reducer,
  // We use the redux-thunk middleware to support making asynchronous
  // requests in our action creators. Note that you can use any system
  // for side-effects that you'd like: redux-thunk, redux-saga,
  // redux-observable – any library works!
  //
  // For more on redux-thunk, refer to the documentation:
  // https://github.com/gaearon/redux-thunk
  applyMiddleware(thunk)
);
