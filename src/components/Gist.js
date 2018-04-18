import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getStatus } from 'redux-resource';
import _ from 'lodash';
import './Gist.css';
import {
  readGist,
  updateGist,
  deleteGist,
  resetUpdateGistStatus
} from '../state/gists/action-creators';

class Gist extends Component {
  render() {
    const {
      readGistStatus,
      deleteGistStatus,
      updateGistStatus,
      gistNotFound
    } = this.props;
    const { description, files } = this.state;

    // When the Gist is successfully deleted, this render function may be called
    // once, or a handful of times. We can just return `null` until the page
    // transition occurs.
    if (deleteGistStatus.succeeded) {
      return null;
    }

    const changePending = updateGistStatus.pending || deleteGistStatus.pending;

    return (
      <div className="Gist">
        {readGistStatus.pending && 'Loading gist...'}
        {readGistStatus.failed &&
          !gistNotFound && (
            <span>
              There was an error while retrieving this gist.{' '}
              <button onClick={this.readGist}>Try again.</button>
            </span>
          )}
        {readGistStatus.failed &&
          gistNotFound &&
          'This gist could not be found.'}
        {readGistStatus.succeeded && (
          <form>
            <div>
              <div className="Gist-actionBar">
                <button
                  className="Gist-saveBtn"
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
                {updateGistStatus.pending && 'Saving gist...'}
                {updateGistStatus.succeeded && 'Saved!'}
                {deleteGistStatus.pending && 'Deleting gist...'}
              </div>
              <div className="Gist-description">
                <div className="Gist-descriptionLabel">Description:</div>
                <input
                  id="gist-description"
                  type="text"
                  className="gist_descriptionInput"
                  value={description}
                  placeholder="Gist description..."
                  onChange={this.onDescriptionChange}
                />
              </div>
              <div>
                {_.map(files, (file, originalFilename) => {
                  return (
                    <div className="Gist-file" key={originalFilename}>
                      <input
                        type="text"
                        className="gist_fileNameInput"
                        value={file.filename}
                        onChange={event =>
                          this.onFileNameChange(originalFilename, event)
                        }
                      />
                      <textarea
                        className="Gist-textarea"
                        disabled={deleteGistStatus.pending}
                        value={file.content}
                        onChange={event =>
                          this.onFileContentsChange(originalFilename, event)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }

  constructor(props) {
    super(props);

    const gist = this.props.gist || {};
    const { description = '', files = [] } = gist;

    this.state = {
      description,
      files
    };
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
    const {
      deleteGistStatus,
      readGistStatus,
      updateGistStatus,
      resetUpdateGistStatus,
      history,
      gist
    } = this.props;
    const { gists, gistId } = prevProps;

    if (deleteGistStatus.succeeded) {
      const prevGistDeleteStatus = getStatus(
        { gists },
        `gists.meta.${gistId}.deleteStatus`
      );

      // When we transition from pending to succeeded, then we know that the deletion was
      // successful. When that happens, we redirect the user back to the homepage.
      if (prevGistDeleteStatus.pending) {
        history.push('/');
      }
    }

    // These checks are a temporary way to handle fetching the "details" of a
    // gist. A Redux Resource plugin would handle this better with some metadata
    // on the resource. For more on plugins, refer to the documentation:
    // https://redux-resource.js.org/docs/other-guides/custom-action-types.html
    if (readGistStatus.succeeded) {
      const prevGistReadStatus = getStatus(
        { gists },
        `gists.meta.${gistId}.readStatus`
      );
      if (prevGistReadStatus.pending) {
        const newState = {
          files: gist.files
        };

        if (!this.state.description) {
          newState.description = gist.description;
        }

        this.setState(newState);
      }
    }

    // If the request just succeeded, then we set a timer to reset the request back to an IDLE
    // state. That way, our success message disappears after a set amount of time.
    if (updateGistStatus.succeeded) {
      const prevGistUpdateStatus = getStatus(
        { gists },
        `gists.meta.${gistId}.updateStatus`
      );
      if (prevGistUpdateStatus.pending) {
        this.resettingUpdate = setTimeout(
          () => resetUpdateGistStatus(gistId),
          1500
        );
      }
    }
  }

  readGist = () => {
    const { readGist, gistId } = this.props;

    if (this.readGistXhr) {
      this.readGistXhr.abort();
    }

    this.readGistXhr = readGist(gistId);
  };

  deleteGist = () => {
    const { gistId, deleteGist } = this.props;

    const confirmedDelete = window.confirm(
      'Are you sure you wish to delete this gist? This cannot be undone.'
    );

    if (confirmedDelete) {
      deleteGist(gistId);
    }
  };

  saveGist = () => {
    const { gistId, updateGist } = this.props;
    const { description, files } = this.state;

    // We may have a timer already set to "reset" the
    // state of the update request if a previous request
    // succeeded. If that is the case, we need to end the
    // timer.
    // For more, see `componentDidUpdate`
    clearTimeout(this.resettingUpdate);

    updateGist(gistId, {
      description,
      files
    });
  };

  onDescriptionChange = event => {
    this.setState({
      description: event.target.value
    });
  };

  onFileNameChange = (oldFilename, event) => {
    const { files } = this.state;
    const clonedFiles = _.cloneDeep(files);
    const existingFile = clonedFiles[oldFilename];
    existingFile.filename = event.target.value;

    this.setState({
      files: clonedFiles
    });
  };

  onFileContentsChange = (oldFilename, event) => {
    const { files } = this.state;
    const clonedFiles = _.cloneDeep(files);
    const existingFile = clonedFiles[oldFilename];
    existingFile.content = event.target.value;

    this.setState({
      files: clonedFiles
    });
  };
}

function mapStateToProps(state, props) {
  const { gists } = state;
  const { match } = props;
  const { gistId } = match.params;

  const gist = gists.resources[gistId];

  // The third argument here is `treatIdleAsPending`. This means that requests with an
  // idle status will be returned as pending, which is ideal for requests that occur
  // when a page first loads. For more, refer to the Tips section of the `getStatus`
  // documentation:
  // https://redux-resource.js.org/docs/api-reference/get-status.html#tips
  const readGistStatus = getStatus(
    state,
    `gists.meta.${gistId}.readStatus`,
    true
  );

  // We're using the HTTP Status Code plugin to determine if the error is a 404. Typically,
  // if you're using standard HTTP requests in your application, you'll want to include the
  // HTTP Status Codes plugin. You can see how this is set up by referring to the gists
  // reducer file. For more on the HTTP Status Codes plugin, see the docs at:
  // https://redux-resource.js.org/docs/extras/http-status-codes-plugin.html
  const gistNotFound =
    _.get(state, `gists.requests.readGist.statusCode`) === 404;

  // These requests are initiated by a user's action, so we do not pass `treatIdleAsPending`
  // as `true`. Otherwise, the interface would always display a loading indicator to the user.
  // Not sure what I mean? Try it out, and you can see what happens.
  const deleteGistStatus = getStatus(
    state,
    `gists.meta.${gistId}.deleteStatus`
  );
  const updateGistStatus = getStatus(
    state,
    `gists.meta.${gistId}.updateStatus`
  );

  return {
    gists,
    gistId,
    gist,
    gistNotFound,
    readGistStatus,
    deleteGistStatus,
    updateGistStatus
  };
}

const mapDispatchToProps = {
  readGist,
  updateGist,
  deleteGist,
  resetUpdateGistStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(Gist);
