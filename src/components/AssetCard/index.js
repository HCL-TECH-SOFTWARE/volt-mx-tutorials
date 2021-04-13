import React, { Component } from 'react';
import Icon from 'antd/lib/icon';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Base64 } from 'js-base64';
import { connect } from 'react-redux';
import style from './style.scss';
import { truncate, validateData } from '../../utils';
import KonyButton from '../KonyButton';
import { getUrl } from '../../utils/initialize';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

class AssetCard extends Component {
  state = {
    itemPath: '#',
    imgOpacity: 1,
    loaded: false,
    loaderDisplay: 'none',
    imagePath: this.props.asset.Logo,
    hover: false,
    query: this.props.keyword ? `search=${this.props.keyword}` : '',
    isViz: this.props.marketplace.isVizWeb,
  };

  isPreviewPresent = validateData(this.props.asset.AppPreviewCode);

  authorURL = () => {
    const { AuthorName, AuthorUID } = this.props.asset;
    const { isVizWeb } = this.props.marketplace;
    const encodedAuthor = Base64.encode(`${AuthorName}::${AuthorUID}`);
    return getUrl(`/author/${encodedAuthor}`, null, isVizWeb);
  };

  itemHover = (e) => {
    e.preventDefault();
    this.setState({
      hover: true,
    });
    if (this.state.imagePath === this.props.asset.Logo && !this.state.loaded) {
      this.setState({
        imgOpacity: 0.5,
        loaderDisplay: 'block',
        itemPath: this.props.asset.Alias,
        imagePath: this.props.asset.OriginalLogo,
      });
    }
  };

  hideLoader = (e) => {
    e.preventDefault();
    if (this.state.hover) {
      this.setState({
        loaderDisplay: 'none',
        imgOpacity: 1,
        loaded: true,
      });
    }
  };

  resetImage = () => {
    this.setState({
      imagePath: this.props.asset.Logo,
      loaded: false,
      loaderDisplay: 'none',
      imgOpacity: 1,
      hover: false,
    });
  };

  assetClick = () => {
    window.dataLayer.push({
      assetTitle: this.props.asset.Title,
      assetAlias: this.props.asset.Alias,
      event: 'assetClick',
    });
  };

  render() {
    const { asset, marketplace } = this.props;
    const { isVizWeb } = marketplace;
    const {
      Title, Alias, AuthorName, Description, Likes,
    } = asset;
    const {
      query, itemPath, imagePath, imgOpacity, loaderDisplay,
    } = this.state;
    return (
      <div className={style.card}>
        <div
          className={style.cover}
          onMouseOver={this.itemHover}
          onFocus={this.itemHover}
          onMouseLeave={this.resetImage}
          onLoad={this.hideLoader}
          onBlur={this.resetImage}
        >
          <Link href={getUrl(itemPath, query, isVizWeb)}>
            <a onClick={this.assetClick} aria-label={`label-${Title}`}>
              <img
                tabIndex="-1"
                src={imagePath}
                alt={`logo-${Title}`}
                style={{ opacity: imgOpacity }}
                className={style.image}
              />
              <div
                className={style.loadingImage}
                style={{ display: loaderDisplay }}
              >
                <img
                  src={`${publicRuntimeConfig.asset}/static/dist/images/loader.svg`}
                  alt="Loader"
                  height={80}
                  width={80}
                />
              </div>
            </a>
          </Link>
        </div>
        <Col className={style.meta}>
          <Row type="flex" className={style.flexRow}>
            <Col
              xs={this.isPreviewPresent ? 15 : 22}
              sm={this.isPreviewPresent ? 18 : 22}
              md={24}
              lg={24}
              className={style.fullHeight}
            >
              <div className={style.fullWidth}>
                <Link href={getUrl(Alias, query, isVizWeb)}>
                  <h4 className={style.title} onClick={this.assetClick}>
                    {
                      truncate(Title, this.isPreviewPresent ? 24 : 26)
                    }
                  </h4>
                </Link>
                <h5 className={style.author}>
                  By:
                  {' '}
                  <Link href={this.authorURL()}>{AuthorName}</Link>
                </h5>
                <Col
                  xs={24}
                  sm={24}
                  md={0}
                  lg={0}
                  className={style.desc}
                >
                  <Link href={getUrl(Alias, query, isVizWeb)}>
                    <span>
                      {
                        truncate(Description, this.isPreviewPresent ? 44 : 55)
                      }
                    </span>
                  </Link>
                </Col>
                <Col
                  lg={24}
                  md={24}
                  xs={0}
                  sm={0}
                  className={style.desc}
                >
                  <Link href={getUrl(Alias, query, isVizWeb)}>
                    <span>
                      {
                        truncate(Description, 70)
                      }
                    </span>
                  </Link>
                </Col>
                <Col className={style.stats} type="flex" md={24} xs={0}>
                  <a href={getUrl(Alias, query, isVizWeb)} aria-label={`label-${Title}`}>
                    <span>
                      <img
                        src={`${publicRuntimeConfig.asset}/static/dist/images/icons/like.svg`}
                        alt={`like-${Title}`}
                        className={style.likeIcon}
                      />
                      {Likes}
                    </span>
                    <span>
                      <img
                        src={`${publicRuntimeConfig.asset}/static/dist/images/icons/download.svg`}
                        alt={`download-${Title}`}
                        className={style.downloadIcon}
                      />
                      {asset.Downloads}
                    </span>
                  </a>
                </Col>
              </div>
            </Col>
            <Col
              lg={0}
              md={0}
              xs={this.isPreviewPresent ? 9 : 2}
              sm={this.isPreviewPresent ? 6 : 2}
              className={style.previewButtonWrapper}
            >
              {this.isPreviewPresent && marketplace?.userType !== 'viewer' ? (
                <KonyButton
                  type="appPreview"
                  title="PREVIEW"
                  href={`https://www.kony.com/marketplace/app_preview?apptolaunch=${
                    asset.AppPreviewCode
                    }`}
                />
              ) : null}
              <Link href={getUrl(asset.Alias, query, isVizWeb)}>
                <a onClick={this.assetClick} aria-label={`label-${Title}`}>
                  <Icon
                    type="right"
                    theme="outlined"
                    className={style.angleRight}
                  />
                </a>
              </Link>
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}

AssetCard.propTypes = {
  asset: PropTypes.object,
};

AssetCard.defaultProps = {
  asset: {},
};

const mapStateToProps = ({ marketplace }) => ({ marketplace });

export default connect(mapStateToProps)(AssetCard);
