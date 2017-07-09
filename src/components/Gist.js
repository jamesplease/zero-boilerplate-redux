import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getStatus } from 'resourceful-redux';
import _ from 'lodash';
import './Gist.css';
import { readGist, deleteGist } from '../state/gists/action-creators';

class Gist extends Component {
  render() {
    const { gist, readGistStatus, deleteGistStatus } = this.props;

    // When the Gist is successfully deleted, this render function may be called
    // once, or a handful of times. We can just return `null` until the page
    // transition occurs.
    if (deleteGistStatus.succeeded) {
      return null;
    }

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
                onClick={this.deleteGist}
                disabled={deleteGistStatus.pending}>
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
                      defaultValue={file.content}
                      onChange={(e) => this.onChangeFile(filename, e)}/>
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
    deleteGist(gistId);
  }

  onChangeFile = (fileName, e) => {
    console.log('updating', fileName, e);
  }
}

function mapStateToProps(state, props) {
  const { gists } = state;
  const { match } = props;
  const { gistId } = match.params;

  const gist = gists.resources[gistId];
  const readGistStatus = getStatus(state, `gists.meta.${gistId}.readStatus`, true);
  const deleteGistStatus = getStatus(state, `gists.meta.${gistId}.deleteStatus`);

  return {
    gists,
    gistId,
    gist,
    readGistStatus,
    deleteGistStatus
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    readGist,
    deleteGist
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Gist);
