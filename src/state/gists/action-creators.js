import { actionTypes } from 'redux-resource';
import {
  createResources, readResources, updateResources, deleteResources
} from 'redux-resource-xhr';
import headers from '../../utils/headers';

// The Redux Resource XHR library only exports bulk actions, so we use this
// function to turn single-resource responses from the server into arrays.
function transformSingular(body) {
  return [body];
}

export function createGist(gist) {
  const xhrOptions = {
    url: 'https://api.github.com/gists',
    json: true,
    body: gist,
    headers
  };

  return dispatch => createResources({
    resourceName: 'gists',
    request: 'createGist',
    list: 'createdGists',
    transformData: transformSingular,
    xhrOptions,
    dispatch
  });
}

export function resetCreateGistStatus() {
  return {
    type: actionTypes.CREATE_RESOURCES_NULL,
    resourceName: 'gists',
    request: 'createGist'
  };
}

export function readGist(gistId) {
  const xhrOptions = {
    url: `https://api.github.com/gists/${gistId}`,
    json: true,
    headers
  };

  return dispatch => readResources({
    resourceName: 'gists',
    resources: [gistId],
    transformData: transformSingular,
    xhrOptions,
    dispatch
  });
}

export function readManyUsersGists(username) {
  const xhrOptions = {
    url: `https://api.github.com/users/${username}/gists`,
    json: true,
    headers
  };

  return dispatch => readResources({
    resourceName: 'gists',
    request: 'getUsersGists',
    list: 'usersGists',
    mergeListIds: false,
    xhrOptions,
    dispatch
  });
}

export function updateGist(gistId, gist) {
  const xhrOptions = {
    url: `https://api.github.com/gists/${gistId}`,
    json: true,
    body: gist,
    headers
  };

  return dispatch => updateResources({
    resourceName: 'gists',
    resources: [gistId],
    transformData: transformSingular,
    xhrOptions,
    dispatch
  });
}

export function deleteGist(gistId) {
  const xhrOptions = {
    url: `https://api.github.com/gists/${gistId}`,
    headers
  };

  return dispatch => deleteResources({
    resourceName: 'gists',
    resources: [gistId],
    xhrOptions,
    dispatch
  });
}
