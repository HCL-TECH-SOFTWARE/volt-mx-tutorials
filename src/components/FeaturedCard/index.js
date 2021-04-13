import React, { Component } from 'react';
import Icon from 'antd/lib/icon';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Base64 } from 'js-base64';
import { connect } from 'react-redux';
import style from './style.scss';
import { truncate, validateData } from '../../utils';
import KonyButton from '../KonyButton';
import { getUrl } from '../../utils/initialize';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

class FeaturedCard extends Component {
  state = {
    itemPath: '#',
    imgOpacity: 1,
    loaded: false,
    loaderDisplay: 'none',
    imagePath: this.props.asset.Logo,
    hover: false,
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
      Title, Alias, AuthorName, Description, Downloads,
    } = asset;
    const {
      itemPath, imgOpacity, loaderDisplay, imagePath,
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
          <Link href={getUrl(itemPath, [], isVizWeb)}>
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
        <Row md={24}>
          <Col className={style.meta}>
            <Row type="flex" className={style.flexRow}>
              <Col xs={22} sm={23} md={24} lg={24} className={style.fullHeight}>
                <div className={style.fullWidth}>
                  <Link href={getUrl(Alias, [], isVizWeb)}>
                    <a onClick={this.assetClick} aria-label={`label-${Title}`}>
                      <h4 className={style.title}>{truncate(asset.Title, 20)}</h4>
                    </a>
                  </Link>
                  <h5 className={style.author}>
                    By:
                    {' '}
                    <Link href={this.authorURL()}>{AuthorName}</Link>
                  </h5>
                  <Col sm={23} xs={23} md={0} lg={0} className={style.desc}>
                    <Link href={getUrl(Alias, [], isVizWeb)}>
                      {
                        truncate(Description, this.isPreviewPresent ? 34 : 55)
                      }
                    </Link>
                  </Col>
                  <Col sm={0} xs={0} md={24} lg={24} className={style.desc}>
                    <Link href={getUrl(Alias, [], isVizWeb)}>
                      {truncate(Description, 70)}
                    </Link>
                  </Col>
                  <Col className={style.stats} md={24} sm={0} xs={0}>
                    <a href={getUrl(Alias, [], isVizWeb)} aria-label={`label-${Title}`}>
                      <span>
                        <img
                          src={`${publicRuntimeConfig.asset}/static/dist/images/icons/like.svg`}
                          alt={`like-${Title}`}
                          className={style.likeIcon}
                        />
                        {asset.Likes}
                      </span>
                      <span>
                        <img
                          src={`${publicRuntimeConfig.asset}/static/dist/images/icons/download.svg`}
                          alt={`download-${Title}`}
                          className={style.downloadIcon}
                        />
                        {Downloads}
                      </span>
                    </a>
                  </Col>
                </div>
                <Col
                  lg={0}
                  md={0}
                  xs={23}
                  sm={23}
                  className={style.previewButtonWrapper}
                >
                  {this.isPreviewPresent && marketplace?.userType !== 'viewer' ? (
                    <KonyButton
                      type="appPreview"
                      className={style.previewButton}
                      title="PREVIEW"
                      featured
                      href={`https://www.kony.com/marketplace/app_preview?apptolaunch=${
                        asset.AppPreviewCode
                      }`}
                    />
                  ) : null}
                </Col>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

FeaturedCard.propTypes = {
  asset: PropTypes.object,
};

FeaturedCard.defaultProps = {
  asset: {},
};

const mapStateToProps = ({ marketplace }) => ({ marketplace });

export default connect(mapStateToProps)(FeaturedCard);
