import React, { Component } from 'react';
import Composer from 'react-composer';
import _ from 'lodash';
import './Gist.css';
import { ReadGist, UpdateGist, DeleteGist } from '../request-components/Gists';

// Note: see the bottom of the file for where this gets connected to the
// Redux store

export class Gist extends Component {
  render() {
    const { gistId, requests } = this.props;
    const { readGist, updateGist, deleteGist } = requests;
    const { description, files } = this.state;

    const gist = readGist.resources[gistId];

    const gistNotFound = readGist.request.statusCode === 404;
    const changePending =
      updateGist.status.pending || deleteGist.status.pending;

    return (
      <div className="Gist">
        {!gist && readGist.status.pending && 'Loading gist...'}
        {!gist &&
          readGist.status.failed &&
          !gistNotFound && (
            <span>
              There was an error while retrieving this gist.{' '}
              <button onClick={() => readGist.doFetch()}>Try again.</button>
            </span>
          )}
        {!gist &&
          readGist.status.failed &&
          gistNotFound &&
          'This gist could not be found.'}
        {gist && (
          <form>
            <div>
              <div className="Gist-actionBar">
                <button
                  className="Gist-saveBtn"
                  onClick={e => this.saveGist(e, updateGist.doFetch)}
                  disabled={changePending}>
                  Save Changes
                </button>
                <button
                  className="Gist-deleteBtn"
                  onClick={e => this.confirmDelete(e, deleteGist.doFetch)}
                  disabled={changePending}>
                  Delete Gist
                </button>
                {updateGist.status.pending && 'Saving gist...'}
                {updateGist.status.succeeded && 'Saved!'}
                {deleteGist.status.pending && 'Deleting gist...'}
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

    const { gistId, requests } = props;
    const { readGist } = requests;
    const gist = readGist.resources[gistId] || {};
    const { description = '', files = [] } = gist;

    this.state = {
      description,
      files
    };
  }

  // I need to update this logic to better handle caches
  componentDidUpdate(prevProps) {
    const { history, requests } = this.props;
    const { readGist, updateGist, deleteGist } = requests;
    const {
      readGist: prevReadGist,
      updateGist: prevUpdateGist,
      deleteGist: prevDeleteGist
    } = prevProps.requests;
    const { gistId } = prevProps;

    const gist = readGist.resources[gistId];

    if (deleteGist.status.succeeded) {
      // When we transition from pending to succeeded, then we know that the deletion was
      // successful. When that happens, we redirect the user back to the homepage.
      if (prevDeleteGist.status.pending) {
        history.push('/');
      }
    }

    if (readGist.status.succeeded) {
      if (prevReadGist.status.pending) {
        const newState = {
          files: gist.files
        };

        if (!this.state.description) {
          newState.description = gist.description;
        }

        this.setState(newState);
      }
    }

    // These checks are a temporary way to handle fetching the "details" of a
    // gist. A Redux Resource plugin would handle this better with some metadata
    // on the resource. For more on plugins, refer to the documentation:
    // https://redux-resource.js.org/docs/guides/plugins.html

    // If the request just succeeded, then we set a timer to reset the request back to a NULL
    // state. That way, our success message disappears after a set amount of time.
    if (updateGist.status.succeeded) {
      if (prevUpdateGist.status.pending) {
        this.resettingUpdate = setTimeout(
          () => updateGist.setFetchToIdle(),
          1500
        );
      }
    }
  }

  syncStateWithGist = () => {};

  confirmDelete = (e, deleteGist) => {
    e.preventDefault();
    const confirmedDelete = window.confirm(
      'Are you sure you wish to delete this gist? This cannot be undone.'
    );

    if (confirmedDelete) {
      deleteGist();
    }
  };

  saveGist = (e, updateGist) => {
    e.preventDefault();
    const { description, files } = this.state;

    // We may have a timer already set to "reset" the
    // state of the update request if a previous request
    // succeeded. If that is the case, we need to end the
    // timer.
    // For more, see `componentDidUpdate`
    clearTimeout(this.resettingUpdate);

    updateGist({
      body: JSON.stringify({
        description,
        files
      })
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

// This component replaces the role of `connect()` from react-redux.
// It's a separate component so that we get our data in the lifecycle
// methods above
export default function GistResources(routeParams) {
  const { gistId } = routeParams.match.params;

  return (
    <Composer
      components={[
        <ReadGist gistId={gistId} />,
        <UpdateGist gistId={gistId} />,
        <DeleteGist gistId={gistId} />
      ]}>
      {([readGist, updateGist, deleteGist]) => (
        <Gist
          requests={{ readGist, updateGist, deleteGist }}
          gistId={gistId}
          {...routeParams}
        />
      )}
    </Composer>
  );
}
