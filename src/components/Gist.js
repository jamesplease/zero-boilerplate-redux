import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getStatus } from 'resourceful-redux';
import _ from 'lodash';
import './Gist.css';
import { readGist } from '../state/gists/action-creators';

class Gist extends Component {
  render() {
    const { gist, readGistStatus } = this.props;

    return (
      <div className="Gist">
        {readGistStatus.pending && ('Loading gist...')}
        {readGistStatus.failed && ('There was an error while retrieving this gist')}
        {readGistStatus.succeeded && (
          <div>
            Description: {gist.description}
            <div>
              {_.map(gist.files, (file, filename) => {
                return (
                  <div key={filename}>
                    <h3>{filename}</h3>
                    <textarea
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

  readGist = () => {
    const { readGist, gistId } = this.props;

    if (this.readGistXhr) {
      this.readGistXhr.abort();
    }

    this.readGistXhr = readGist(gistId);
  }

  onChangeFile = (fileName, e) => {
    console.log('updating', fileName, e);
  }
}

function mapStateToProps(state, props) {
  const { match } = props;
  const { gistId } = match.params;

  const gist = state.gists.resources[gistId];
  const readGistStatus = getStatus(state, `gists.meta.${gistId}.readStatus`, true);

  return {
    gistId,
    gist,
    readGistStatus
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    readGist
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Gist);
