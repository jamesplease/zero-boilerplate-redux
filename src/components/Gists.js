import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Gists.css';
import { ReadUsersGists } from '../request-components/Gists';
import login from '../personal-access-token';

const username = login.username;

export default function Gists() {
  return (
    <ReadUsersGists username={username}>
      {({ status, lists, doFetch }) => (
        <div>
          {status.pending && 'Loading gists...'}
          {status.failed && (
            <span>
              There was an error loading gists.{' '}
              <button onClick={() => doFetch()}>Try again.</button>
            </span>
          )}
          {status.succeeded && (
            <ul className="Gists-list">
              {lists.usersGists.map(gist => (
                <li key={gist.id} className="Gists-listItem">
                  {username}&nbsp;/&nbsp;
                  <Link to={`/${gist.id}`}>{Object.keys(gist.files)[0]}</Link>
                  &nbsp;
                  {!gist.public && '🔒'}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </ReadUsersGists>
  );
}
