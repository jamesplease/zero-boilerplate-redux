import React from 'react';
import { ResourceRequest, Fetch } from 'react-redux-resource';
import headers from '../utils/headers';

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
