import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import style from './style.scss';
import KonyVideoPlayer from './KonyVideoPlayer';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

class ScreenshotPreview extends Component {
  constructor(props) {
    super(props);
    let firstImage = this.props.slides[0];
    if (!firstImage) {
      firstImage = `${publicRuntimeConfig.asset}/static/dist/images/kony_logo.png`;
    }
    this.state = {
      activeImagePathDuplicate: firstImage,
      activeImagePath: firstImage,
      activeThumbnailElement: '',
    };
  }

  static getDerivedStateFromProps(props, currentState) {
    let firstImage = props.slides[0];
    if (!firstImage) {
      firstImage = `${publicRuntimeConfig.asset}/static/dist/images/kony_logo.png`;
    }
    if (firstImage !== currentState.activeImagePathDuplicate) {
      return {
        ...currentState,
        activeImagePath: firstImage,
        activeImagePathDuplicate: firstImage,
      };
    }
    return null;
  }

  getThumbnail(element, i) {
    let thumbPath = '';
    if (!element) {
      thumbPath = `${publicRuntimeConfig.asset}/static/dist/images/kony_logo.png`;
      return (
        <img
          src={thumbPath}
          alt="thumbnail"
          onClick={e => this.setActiveImagePath(e, thumbPath)}
        />
      );
    }
    if (element.indexOf('.mp4') > 0) {
      thumbPath = `${publicRuntimeConfig.asset}/static/dist/images/videoPlaceholder.png`;
    } else {
      thumbPath = element;
    }
    return (
      <img
        src={thumbPath}
        alt={`${this.props.title} - Screen-Thumbnail`}
        onClick={e => this.setActiveImagePath(e, element)}
      />);
  }

  setActiveImagePath(e, path) {
    this.setState({ activeImagePath: path, activeThumbnailElement: path });
  }

  getActiveImage() {
    const { activeImagePath } = this.state;
    const { title } = this.props;
    if (activeImagePath && activeImagePath.indexOf('.mp4') > 0) {
      return (<KonyVideoPlayer src={activeImagePath} />);
    }
    return (<img src={activeImagePath} alt={`${title} - Screen`} />);
  }

  render() {
    const { slides } = this.props;
    const { activeImagePath } = this.state;
    return (
      <Row gutter={10} type="flex">
        <Col>
          <div className={style.thumbnailFilmstrip}>
            <ul>
              {
                slides && slides.length > 0
                  ? _map(slides,
                    (value, i) => (
                      <li key={i} className={activeImagePath && value === activeImagePath ? style.thumbnailBorder : ''}>
                        {
                          this.getThumbnail(value, i)
                        }
                      </li>
                    )) : (
                      <li className={style.thumbnailBorder}>
                        {
                          this.getThumbnail()
                        }
                      </li>
                  )
              }
            </ul>
          </div>
        </Col>
        <Col>
          <div className={style.mainImageContainer}>
            {this.getActiveImage()}
          </div>
        </Col>
      </Row>
    );
  }
}


ScreenshotPreview.propTypes = {
  slides: PropTypes.array,
};

ScreenshotPreview.defaultProps = {
  slides: [],
};

export default ScreenshotPreview;
