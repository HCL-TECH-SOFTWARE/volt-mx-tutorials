import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { oauthActions } from '../src/actions';
import KonyLoader from '../src/components/KonyLoader';

class Auth extends Component {
  componentDidMount() {
    const query = this.props.url.query;
    if (process.browser) {
      this.props.login(query);
    }
  }

  render() {
    return <KonyLoader />;
  }
}

function mapStateToProps({ marketplace, assets }) {
  return {
    mp: marketplace,
    assets
  };
}
const mapDispatchToProps = dispatch => bindActionCreators({ ...oauthActions }, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
