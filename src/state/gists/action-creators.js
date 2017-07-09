import {
  createResources, readResources, updateResources, deleteResources
} from 'resourceful-action-creators';
import headers from '../../utils/headers';

// Resourceful Action Creators only exports bulk actions, so we use this to
// coerce single-resource responses into arrays
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

  return createResources({
    resourceName: 'gists',
    label: 'createGist',
    transformData: transformSingular,
    xhrOptions
  });
}

export function readGist(gistId) {
  const xhrOptions = {
    url: `https://api.github.com/gists/${gistId}`,
    json: true,
    headers
  };

  return readResources({
    resourceName: 'gists',
    resources: [gistId],
    transformData: transformSingular,
    xhrOptions,
  });
}

export function readManyUsersGists(username) {
  const xhrOptions = {
    url: `https://api.github.com/users/${username}/gists`,
    json: true,
    headers
  };

  return readResources({
    resourceName: 'gists',
    label: 'usersGists',
    mergeLabelIds: false,
    xhrOptions
  });
}

export function updateGist(gistId, gist) {
  const xhrOptions = {
    url: `https://api.github.com/gists/${gistId}`,
    json: true,
    body: gist,
    headers
  };

  return updateResources({
    resourceName: 'gists',
    resources: [gistId],
    transformData: transformSingular,
    xhrOptions
  });
}

export function deleteGist(gistId) {
  const xhrOptions = {
    url: `https://api.github.com/gists/${gistId}`,
    headers
  };

  return deleteResources({
    resourceName: 'gists',
    resources: [gistId],
    xhrOptions
  });
}
