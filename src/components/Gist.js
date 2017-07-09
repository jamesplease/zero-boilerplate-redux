import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getStatus } from 'resourceful-redux';
import _ from 'lodash';
import './Gist.css';
import { readGist, updateGist, deleteGist } from '../state/gists/action-creators';

class Gist extends Component {
  render() {
    const {
      gist, readGistStatus, deleteGistStatus, updateGistStatus
    } = this.props;

    // When the Gist is successfully deleted, this render function may be called
    // once, or a handful of times. We can just return `null` until the page
    // transition occurs.
    if (deleteGistStatus.succeeded) {
      return null;
    }

    const changePending = updateGistStatus.pending || deleteGistStatus.pending;

    return (
      <div className="Gist">
        {readGistStatus.pending && ('Loading gist...')}
        {readGistStatus.failed && ('There was an error while retrieving this gist')}
        {readGistStatus.succeeded && (
          <div>
            <div className="Gist-description">
              Description: {gist.description}
            </div>
            <div>
              <button
                className="Gist-deleteBtn"
                onClick={this.saveGist}
                disabled={changePending}>
                Save Changes
              </button>
              <button
                className="Gist-deleteBtn"
                onClick={this.deleteGist}
                disabled={changePending}>
                Delete Gist
              </button>
            </div>
            <div>
              {_.map(gist.files, (file, filename) => {
                return (
                  <div key={filename}>
                    <h3>{filename}</h3>
                    <textarea
                      disabled={deleteGistStatus.pending}
                      defaultValue={file.content}/>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.readGist();
  }

  componentWillUnmount() {
    if (this.readGistXhr) {
      this.readGistXhr.abort();
    }
  }

  componentDidUpdate(prevProps) {
    const { deleteGistStatus, history } = this.props;

    if (!deleteGistStatus.succeeded) {
      return;
    }

    const { gists, gistId } = prevProps;
    const prevGistDeleteStatus = getStatus({ gists }, `gists.meta.${gistId}.deleteStatus`);
    if (prevGistDeleteStatus.pending) {
      history.push('/');
    }
  }

  readGist = () => {
    const { readGist, gistId } = this.props;

    if (this.readGistXhr) {
      this.readGistXhr.abort();
    }

    this.readGistXhr = readGist(gistId);
  }

  deleteGist = () => {
    const { gistId, deleteGist } = this.props;
    const confirmedDelete = window.confirm(
      'Are you sure you wish to delete this gist? This cannot be undone.'
    );
    if (confirmedDelete) {
      deleteGist(gistId);
    }
  }

  saveGist = () => {
    const { gistId, updateGist } = this.props;

    updateGist(gistId, {
      description: 'the description for this gist',
      files: {
        'file1.txt': {
          content: 'updated file contents'
        },
        'old_name.txt': {
          filename: 'new_name.txt',
          content: 'modified contents'
        },
        'new_file.txt': {
          content: 'a new file'
        }
      }
    });
  }
}

function mapStateToProps(state, props) {
  const { gists } = state;
  const { match } = props;
  const { gistId } = match.params;

  const gist = gists.resources[gistId];
  const readGistStatus = getStatus(state, `gists.meta.${gistId}.readStatus`, true);
  const deleteGistStatus = getStatus(state, `gists.meta.${gistId}.deleteStatus`);
  const updateGistStatus = getStatus(state, `gists.meta.${gistId}.updateStatus`);

  return {
    gists,
    gistId,
    gist,
    readGistStatus,
    deleteGistStatus,
    updateGistStatus
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    readGist,
    updateGist,
    deleteGist
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Gist);
