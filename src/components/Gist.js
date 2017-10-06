import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getStatus } from 'redux-resource';
import _ from 'lodash';
import './Gist.css';
import { readGist, updateGist, deleteGist } from '../state/gists/action-creators';

class Gist extends Component {
  render() {
    const {
      readGistStatus, deleteGistStatus, updateGistStatus
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
        {readGistStatus.pending && ('Loading gist...')}
        {readGistStatus.failed && ('There was an error while retrieving this gist')}
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
                {deleteGistStatus.pending && 'Deleting gist...'}
              </div>
              <div className="Gist-description">
                <div className="Gist-descriptionLabel">
                  Description:
                </div>
                <input
                  id="gist-description"
                  type="text"
                  className="gist_descriptionInput"
                  value={description}
                  placeholder="Gist description..."
                  onChange={this.onDescriptionChange}/>
              </div>
              <div>
                {_.map(files, (file, originalFilename) => {
                  return (
                    <div className="Gist-file" key={originalFilename}>
                      <input
                        type="text"
                        className="gist_fileNameInput"
                        value={file.filename}
                        onChange={(event) => this.onFileNameChange(originalFilename, event)}/>
                      <textarea
                        className="Gist-textarea"
                        disabled={deleteGistStatus.pending}
                        value={file.content}
                        onChange={(event) => this.onFileContentsChange(originalFilename, event)}/>
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
    const { description, files } = gist;

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
    const { deleteGistStatus, readGistStatus, history, gist } = this.props;

    if (deleteGistStatus.succeeded) {
      const { gists, gistId } = prevProps;
      const prevGistDeleteStatus = getStatus({ gists }, `gists.meta.${gistId}.deleteStatus`);

      // When we transition from pending to succeeded, then we know that the deletion was
      // successful. When that happens, we redirect the user back to the homepage.
      if (prevGistDeleteStatus.pending) {
        history.push('/');
      }
    }

    // These checks are a temporary way to handle fetching the "details" of a
    // gist. A Redux Resource plugin would handle this better with some metadata
    // on the resource. For more on plugins, refer to the documentation:
    // https://redux-resource.js.org/docs/guides/plugins.html
    if (readGistStatus.succeeded) {
      const { gists, gistId } = prevProps;
      const prevGistReadStatus = getStatus({ gists }, `gists.meta.${gistId}.readStatus`);
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
    const { description, files } = this.state;

    updateGist(gistId, {
      description,
      files
    });
  }

  onDescriptionChange = (event) => {
    this.setState({
      description: event.target.value
    });
  }

  onFileNameChange = (oldFilename, event) => {
    const { files } = this.state;
    const clonedFiles = _.cloneDeep(files);
    const existingFile = clonedFiles[oldFilename];
    existingFile.filename = event.target.value;

    this.setState({
      files: clonedFiles
    });
  }

  onFileContentsChange = (oldFilename, event) => {
    const { files } = this.state;
    const clonedFiles = _.cloneDeep(files);
    const existingFile = clonedFiles[oldFilename];
    existingFile.content = event.target.value;

    this.setState({
      files: clonedFiles
    });
  }
}

function mapStateToProps(state, props) {
  const { gists } = state;
  const { match } = props;
  const { gistId } = match.params;

  const gist = gists.resources[gistId];

  // The third argument here is `treatNullAsPending`. This means that requests with a
  // null status will be returned as pending, which is ideal for requests that occur
  // when a page first loads. For more, refer to the Tips section of the `getStatus`
  // documentation:
  // https://redux-resource.js.org/docs/api-reference/get-status.html#tips
  const readGistStatus = getStatus(state, `gists.meta.${gistId}.readStatus`, true);

  // These requests are initiated by a user's action, so we do not pass `treatNullAsPending`
  // as `true`. Otherwise, the interface would always display a loading indicator to the user.
  // Not sure what I mean? Try it out, and you can see what happens.
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
