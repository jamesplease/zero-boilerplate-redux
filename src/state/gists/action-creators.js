// Looking for the HTTP request action creators?
// They don't exist. The components that make requests
// can be found in the `./src/request-components/Gists`
// directory

export function resetUpdateGistStatus(gistId) {
  return {
    type: actionTypes.UPDATE_RESOURCES_NULL,
    resourceName: 'gists',
    resources: [gistId]
  };
}
