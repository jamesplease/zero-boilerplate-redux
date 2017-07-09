import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatus, getResources } from 'resourceful-redux';
import { createGist } from '../state/gists/action-creators';

class CreateGist extends Component {
  render() {
    const { createGistStatus, createdGist } = this.props;

    return (
      <div className="Gist">
        {createGistStatus.succeeded && (
          <div>
            Your gist was successfully created.
            <Link to={`/${createdGist.id}`}>
              Go to Gist details.
            </Link>
          </div>
        )}
        {!createGistStatus.succeeded && (
          <button
            onClick={this.createGist}
            disabled={createGistStatus.pending}>
            Create Gist
          </button>
        )}
      </div>
    );
  }

  createGist = () => {
    const { createGist } = this.props;

    createGist({
      description: 'the description for this gist',
      public: true,
      files: {
        'file1.txt': {
          content: 'String file contents'
        }
      }
    });
  }
}

function mapStateToProps(state, props) {
  const createGistStatus = getStatus(state, 'gists.labels.createGist.status');
  const createdGist = getResources(state, 'gists', 'createGist')[0];

  return {
    createdGist,
    createGistStatus
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createGist
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGist);
