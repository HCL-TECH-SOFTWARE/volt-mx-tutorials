import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style.scss';
import KonyLoader from '../KonyLoader';

class DocInIFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  hideLoader(e) {
    this.setState({
      loading: false,
    });
  }

  render() {
    return (
      <table
        border={0}
        cellSpacing={0}
        cellPadding={0}
        className={style.iframeContainer}
      >
        <iframe
          className={`${style.iframe} ${this.state.loading ? style.hide : ''}`}
          src={this.props.src}
          title="Documentation"
          onLoad={e => this.hideLoader(e)}
        />
        <KonyLoader inline className={this.state.loading ? '' : style.hide} />
      </table>
    );
  }
}

DocInIFrame.propTypes = {
  src: PropTypes.string,
};

DocInIFrame.defaultProps = {
  src: '',
};

export default DocInIFrame;
