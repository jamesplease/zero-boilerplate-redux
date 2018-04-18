import { actionTypes } from 'redux-resource';
import { crudRequest } from 'redux-resource-xhr';
import headers from '../../utils/headers';

// This file heavily leverages the Redux Resource XHR library. To learn
// more about its API, refer to the documentation:
// https://redux-resource.js.org/docs/extras/redux-resource-xhr.html

// The Redux Resource XHR library only exports bulk actions, so we use this
// function to turn single-resource responses from the server into arrays.
function singleResourceToArray(body) {
  return [body];
}

export function createGist(gist) {
  const xhrOptions = {
    method: 'POST',
    url: 'https://api.github.com/gists',
    json: true,
    body: gist,
    headers
  };

  return dispatch =>
    crudRequest('create', {
      actionDefaults: {
        resourceType: 'gists',
        requestKey: 'createGist',
        list: 'createdGists'
      },
      transformData: singleResourceToArray,
      xhrOptions,
      dispatch
    });
}

export function resetCreateGistStatus() {
  return {
    type: actionTypes.CREATE_RESOURCES_IDLE,
    resourceType: 'gists',
    requestKey: 'createGist'
  };
}

export function readGist(gistId) {
  const xhrOptions = {
    method: 'GET',
    url: `https://api.github.com/gists/${gistId}`,
    json: true,
    headers
  };

  return dispatch =>
    crudRequest('read', {
      actionDefaults: {
        resourceType: 'gists',
        resources: [gistId]
      },
      transformData: singleResourceToArray,
      xhrOptions,
      dispatch
    });
}

export function readManyUsersGists(username) {
  const xhrOptions = {
    method: 'GET',
    url: `https://api.github.com/users/${username}/gists`,
    json: true,
    headers
  };

  return dispatch =>
    crudRequest('read', {
      actionDefaults: {
        resourceType: 'gists',
        requestKey: 'getUsersGists',
        list: 'usersGists',
        mergeListIds: false
      },
      xhrOptions,
      dispatch
    });
}

export function updateGist(gistId, gist) {
  const xhrOptions = {
    method: 'PATCH',
    url: `https://api.github.com/gists/${gistId}`,
    json: true,
    body: gist,
    headers
  };

  return dispatch =>
    crudRequest('update', {
      actionDefaults: {
        resourceType: 'gists',
        resources: [gistId]
      },
      transformData: singleResourceToArray,
      xhrOptions,
      dispatch
    });
}

export function resetUpdateGistStatus(gistId) {
  return {
    type: actionTypes.UPDATE_RESOURCES_IDLE,
    resourceType: 'gists',
    resources: [gistId]
  };
}

export function deleteGist(gistId) {
  const xhrOptions = {
    method: 'DELETE',
    url: `https://api.github.com/gists/${gistId}`,
    headers
  };

  return dispatch =>
    crudRequest('delete', {
      actionDefaults: {
        resourceType: 'gists',
        resources: [gistId]
      },
      xhrOptions,
      dispatch
    });
}
