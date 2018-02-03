import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { CreateGist } from '../request-components/Gists';
import { resetCreateGistStatus } from '../state/gists/action-creators';

export default class NewGist extends Component {
  render() {
    const { description } = this.state;

    return (
      <CreateGist>
        {({ status, lists, doFetch }) => (
          <div className="Gist">
            {status.succeeded && (
              <div>
                Your gist was successfully created.{' '}
                <Link to={`/${lists.createdGists[0].id}`}>
                  Go to Gist details.
                </Link>
              </div>
            )}
            {!status.succeeded && (
              <div>
                <div className="Gist-actionBar">
                  <button
                    onClick={() => doFetch(this.getCreateRequestBody())}
                    disabled={status.pending}>
                    Create Gist
                  </button>
                  {status.pending && 'Creating gist...'}
                  {status.failed &&
                    'An error occurred while creating the gist.'}
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
              </div>
            )}
          </div>
        )}
      </CreateGist>
    );
  }

  state = {
    description: '',
    files: {}
  };

  getCreateRequestBody = () => {
    const { createGist } = this.props;
    const { description } = this.state;

    const gist = {
      description,
      public: true,
      files: {
        'file1.txt': {
          content: 'String file contents'
        }
      }
    };

    return {
      body: JSON.stringify(gist)
    };
  };

  onDescriptionChange = event => {
    this.setState({
      description: event.target.value
    });
  };
}
