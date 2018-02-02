import React from 'react';
import { ResourceRequest, Fetch } from 'react-redux-resource';
import headers from '../utils/headers';

export function ReadGist({ gistId, children }) {
  const ReadGistRequest = (
    <Fetch url={`https://api.github.com/gists/${gistId}`} headers={headers} />
  );

  return (
    <ResourceRequest
      treatNullAsPending
      transformData={gist => [gist]}
      resourceName="gists"
      request={ReadGistRequest}
      children={children}
    />
  );
}
