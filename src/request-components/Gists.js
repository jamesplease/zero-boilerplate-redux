import React from 'react';
import { ResourceRequest, Fetch } from 'react-redux-resource';
import headers from '../utils/headers';

// The Redux Resource XHR library only exports bulk actions, so we use this
// function to turn single-resource responses from the server into arrays.
function singleResourceToArray(body) {
  return [body];
}

export function ReadGist({ gistId, children }) {
  const request = (
    <Fetch url={`https://api.github.com/gists/${gistId}`} headers={headers} />
  );

  return (
    <ResourceRequest
      treatNullAsPending
      transformData={gist => [gist]}
      resourceName="gists"
      request={request}
      children={children}
    />
  );
}

export function ReadUsersGists({ username, children }) {
  const request = (
    <Fetch
      url={`https://api.github.com/users/${username}/gists`}
      headers={headers}
    />
  );

  return (
    <ResourceRequest
      treatNullAsPending
      resourceName="gists"
      list="usersGists"
      mergeListIds={false}
      request={request}
      children={children}
    />
  );
}

export function CreateGist({ children }) {
  const request = (
    <Fetch method="POST" url="https://api.github.com/gists" headers={headers} />
  );

  return (
    <ResourceRequest
      resourceName="gists"
      transformData={singleResourceToArray}
      list="createdGists"
      request={request}
      children={children}
    />
  );
}

export function UpdateGist({ gistId, children }) {
  const request = (
    <Fetch
      method="PATCH"
      url={`https://api.github.com/gists/${gistId}`}
      headers={headers}
    />
  );

  return (
    <ResourceRequest
      resourceName="gists"
      resources={[gistId]}
      transformData={singleResourceToArray}
      request={request}
      children={children}
    />
  );
}

export function DeleteGist({ gistId, children }) {
  const request = (
    <Fetch
      method="DELETE"
      responseType="text"
      url={`https://api.github.com/gists/${gistId}`}
      headers={headers}
    />
  );

  return (
    <ResourceRequest
      resourceName="gists"
      resources={[gistId]}
      request={request}
      children={children}
    />
  );
}
