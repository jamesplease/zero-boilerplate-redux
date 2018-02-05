import { resourceReducer } from 'react-redux-resource';
import { httpStatusCodes } from 'redux-resource-plugins';

// This reducer manages our gists resource. I normally prefer a "ducks"-style
// organization scheme, but with React Redux Resource, you don't need to do anything
// other than define the reducer. Neat.
export default resourceReducer('gists', {
  plugins: [
    // This plugin gives us access to the HTTP Status Codes from our requests. The primary
    // use case for this is differentiating different failed requests. For instance,
    // did the request fail because the user was unauthorized, or because the resource
    // was not found? For more on the HTTP Status Codes plugin, see the documentation at:
    // https://redux-resource.js.org/docs/extras/http-status-codes-plugin.html
    httpStatusCodes
  ]
});
