import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import Icon from 'antd/lib/icon';
import PropTypes from 'prop-types';
import style from './style.scss';

class KonyVideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: true,
      className: 'hidden',
    };
  }

  onPlay = () => {
    this.setState({ playing: true, className: 'hidden' });
  };

  onPause = () => {
    this.setState({ playing: false, className: 'visible' });
  };

  ref = (player) => {
    this.player = player;
  };

  render() {
    const { playing } = this.state;
    return (
      <div>
        <ReactPlayer
          ref={this.ref}
          width="100%"
          height="auto"
          url={this.props.src}
          playing={playing}
          onPlay={this.onPlay}
          onPause={this.onPause}
          onClick={this.onPause}
          onEnded={this.onPause}
          className={`${style.videoPlayer} ${style[this.state.className]}`}
          volume={0}
          muted
        />
        <span className={`${style.playpause} ${style[this.state.className]}`} onClick={this.onPlay}>
          <Icon type="play-circle" />
        </span>
      </div>
    );
  }
}

KonyVideoPlayer.propTypes = {
  src: PropTypes.string,
};

KonyVideoPlayer.defaultProps = {
  src: '',
};

export default KonyVideoPlayer;
