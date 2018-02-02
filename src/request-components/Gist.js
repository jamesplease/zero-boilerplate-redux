import React from 'react';
import { Resource, Fetch } from 'react-redux-resource';
import headers from '../utils/headers';

export function ReadGist({ gistId, children }) {
  const ReadGistRequest = (
    <Fetch url={`https://api.github.com/gists/${gistId}`} headers={headers} />
  );

  return <Resource request={ReadGistRequest} children={children} />;
}
