import {
  createResources, readResources, updateResources, deleteResources
} from 'resourceful-redux/action-creators';
import headers from '../../common/utils/headers';

export function createGist(gist) {
  const xhrOptions = {
    url: '/gists',
    json: true,
    body: gist,
    headers
  };

  return createResources({
    label: 'createGist',
    xhrOptions
  });
}

export function readGist(gistId) {
  const xhrOptions = {
    url: `/gists/${gistId}`,
    json: true,
    headers
  };

  return readResources({
    resources: [gistId],
    xhrOptions
  });
}

export function readManyUsersGists(username) {
  const xhrOptions = {
    url: `/users/${username}/gists`,
    json: true,
    headers
  };

  return readResources({
    label: 'usersGists',
    xhrOptions
  });
}

export function updateGist(gistId, gist) {
  const xhrOptions = {
    url: `/gists/${gistId}`,
    json: true,
    body: gist,
    headers
  };

  return updateResources({
    resources: [gistId],
    xhrOptions
  });
}

export function deleteGist(gistId) {
  const xhrOptions = {
    url: `/gists/${gistId}`,
    headers
  };

  return deleteResources({
    resources: [gistId],
    xhrOptions
  });
}
