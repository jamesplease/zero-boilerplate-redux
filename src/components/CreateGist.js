import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatus, getResources } from 'redux-resource';
import { createGist, resetCreateGistStatus } from '../state/gists/action-creators';

class CreateGist extends Component {
  render() {
    const { createGistStatus, createdGist } = this.props;
    const { description } = this.state;

    return (
      <div className="Gist">
        {createGistStatus.succeeded && (
          <div>
            Your gist was successfully created.
            {' '}
            <Link to={`/${createdGist.id}`}>
              Go to Gist details.
            </Link>
          </div>
        )}
        {!createGistStatus.succeeded && (
          <div>
            <div className="Gist-actionBar">
              <button
                onClick={this.createGist}
                disabled={createGistStatus.pending}>
                Create Gist
              </button>
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
          </div>
        )}
      </div>
    );
  }

  state = {
    description: '',
    files: {}
  };

  componentWillUnmount() {
    const { resetCreateGistStatus } = this.props;

    if (this.createGistXhr) {
      this.createGistXhr.abort();
    }

    // We need to reset whatever the current status of the create request is
    // when we navigate away. That way, users can create new gists when they
    // return.
    resetCreateGistStatus();
  }

  createGist = () => {
    const { createGist } = this.props;
    const { description } = this.state;

    this.createGistXhr = createGist({
      description,
      public: true,
      files: {
        'file1.txt': {
          content: 'String file contents'
        }
      }
    });
  }

  onDescriptionChange = (event) => {
    this.setState({
      description: event.target.value
    });
  }
}

function mapStateToProps(state, props) {
  const createGistStatus = getStatus(state, 'gists.requests.createGist.status');
  const createdGist = getResources(state, 'gists', 'createdGists')[0];

  return {
    createdGist,
    createGistStatus
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createGist,
    resetCreateGistStatus
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGist);
