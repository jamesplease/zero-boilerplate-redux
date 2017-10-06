import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getResources, getStatus } from 'redux-resource';
import './Gists.css';
import { readManyUsersGists } from '../state/gists/action-creators';
import login from '../personal-access-token';

const username = login.username;

class Gists extends Component {
  render() {
    const { usersGists, usersGistsStatus } = this.props;

    return (
      <div className="Gists">
        {usersGistsStatus.pending && ('Loading gists...')}
        {usersGistsStatus.failed && ('There was an error loading gists.')}
        {usersGistsStatus.succeeded && (
          <ul className="Gists-list">
            {usersGists.map(gist => (
              <li key={gist.id} className="Gists-listItem">
                {username}&nbsp;/&nbsp;
                <Link to={`/${gist.id}`}>
                  {Object.keys(gist.files)[0]}
                </Link>
                &nbsp;
                {!gist.public && '🔒'}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.fetchUsersGists();
  }

  componentWillUnmount() {
    if (this.readManyUsersGistsXhr) {
      this.readManyUsersGistsXhr.abort();
    }
  }

  fetchUsersGists = () => {
    const { readManyUsersGists } = this.props;

    if (this.readManyUsersGistsXhr) {
      this.readManyUsersGistsXhr.abort();
    }

    this.readManyUsersGistsXhr = readManyUsersGists(username);
  }
}

function mapStateToProps(state) {
  const usersGists = getResources(state, 'gists', 'usersGists');
  const usersGistsStatus = getStatus(state, 'gists.requests.getUsersGists.status', true);

  return {
    usersGists,
    usersGistsStatus
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    readManyUsersGists
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Gists);
