import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import gists from './gists/reducer';

const reducer = combineReducers({
  gists
});

export default createStore(
  reducer,
  applyMiddleware(thunk)
);
