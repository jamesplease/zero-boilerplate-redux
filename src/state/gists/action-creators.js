import {
  createResources, readResources, updateResources, deleteResources
} from 'resourceful-redux/action-creators';
import headers from '../../common/utils/headers';

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
    xhrOptions
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
