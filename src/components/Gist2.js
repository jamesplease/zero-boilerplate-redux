import React, { Component } from 'react';
import _ from 'lodash';
import { ReadGist } from '../request-components/Gists';

export default class Gist extends Component {
  render() {
    const {gistId} = this.props.match.params;

    return (<ReadGist gistId={gistId}>
      {stuff => {
        const { status, doFetch } = stuff;
        const { description, files } = this.state;

        return (
          <div>
            {status.pending && ('Loading gist...')}
            {status.failed && (
              <span>
                There was an error while retrieving this gist. <button onClick={() => doFetch()}>Try again.</button>
              </span>
            )}
            {status.succeeded && (
              <form>
              <div>
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
      }}
    </ReadGist>);
  }

  constructor(props) {
    super(props);

    const gist = this.props.gist || {};
    const {
      description = '',
      files = []
    } = gist;

    this.state = {
      description,
      files
    };
  }
}