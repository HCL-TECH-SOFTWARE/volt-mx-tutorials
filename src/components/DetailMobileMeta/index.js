import React, { Component } from 'react';
import Link from 'next/link';
import Row from 'antd/lib/row';
import Select from 'antd/lib/select';
import _map from 'lodash/map';
import Col from 'antd/lib/col';
import PropTypes from 'prop-types';
import { Base64 } from 'js-base64';
import { connect } from 'react-redux';
import style from './style.scss';
import KonyButton from '../KonyButton';
import KonyLoader from '../KonyLoader';
import { getUrl } from '../../utils/initialize';
import AssetDownloadButton from '../AssetDownloadButton';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const { Option } = Select;

class DetailMobileMeta extends Component {
  state = {
    imgOpacity: 1,
    loaderDisplay: 'none',
    imagePath: this.props.asset.StillLogo,
    clicked: false,
  };

  handleClick = (e) => {
    e.preventDefault();
    if (this.state.clicked && this.state.imagePath === this.props.asset.Logo) {
      if (this.state.imagePath === this.props.asset.Logo) {
        this.setState({
          imgOpacity: 1,
          loaderDisplay: 'none',
          imagePath: this.props.asset.StillLogo,
        });
      } else {
        this.setState({
          imgOpacity: 1,
          loaderDisplay: 'none',
          imagePath: this.props.asset.Logo,
        });
      }
    } else {
      this.setState({
        clicked: true,
        imgOpacity: 0.5,
        loaderDisplay: 'block',
        imagePath: this.props.asset.Logo,
      });
    }
  };

  hideLoader = () => {
    this.setState({
      loaderDisplay: 'none',
      imgOpacity: 1,
    });
  };

  resetImage = () => {
    this.setState({
      imagePath: this.props.asset.Logo,
    });
  };

  getAssetVersion() {
    if (this.props.totalAssets === 1) {
      return `Asset Version: ${this.props.asset.Version}`;
    }
    return (
      <React.Fragment>
        <span>Asset Version:</span>
        <Select
          className={style.selector}
          dropdownClassName={style.dropdown}
          defaultValue={Number(this.props.metaDetails.latest_published_asset)}
          onChange={value => this.handleChange(value)}
          suffixIcon={(
            <img
              src={`${publicRuntimeConfig.asset}/static/dist/images/icons/navBarArrow.svg`}
              alt="Sort icon"
              className={style.angleDownIcon}
            />
          )}
        >
          {
            _map(this.props.metaDetails.sorted_option,
              (k, v) => (
                <Option
                  key={Number(v)}
                  value={Number(v)}
                >
                  {
                    k
                  }
                </Option>
              ))
          }
        </Select>
      </React.Fragment>
    );
  }

  handleChange(value) {
    this.props.changeAsset(value);
  }

  authorURL = () => {
    const { AuthorName, AuthorUID } = this.props.asset;
    const { isVizWeb } = this.props.marketplace;
    const encodedAuthor = Base64.encode(`${AuthorName}::${AuthorUID}`);
    return getUrl(`/author/${encodedAuthor}`, null, isVizWeb);
  };

  getAuthorName() {
    if (this.props.asset.AuthorName) {
      return (
        <Row span={24}>
          By:
          {' '}
          <Link href={this.authorURL()}>{this.props.asset.AuthorName}</Link>
        </Row>);
    }
    return null;
  }

  render() {
    const { asset, marketplace } = this.props;
    return (
      <Row>
        <Col xs={8} className={style.cover}>
          <div className={style.cover}>
            <img
              src={this.state.imagePath}
              onClick={this.handleClick}
              onLoad={this.hideLoader}
              alt="Asset Logo"
              style={{ opacity: this.state.imgOpacity }}
              onBlur={this.resetImage}
              className={style.image}
            />
            <div
              id="loading-img"
              className={style.loadingImage}
              style={{ display: this.state.loaderDisplay }}
            >
              <KonyLoader inline size={120} />
            </div>
          </div>
        </Col>
        <Col xs={13} className={style.meta}>
          <Row span={24} className={style.assetVersion}>
            {this.getAssetVersion()}
          </Row>
          <Row span={24} className={style.publishDate}>
            <Row span={24}>
              {`Last Published: ${asset.PublishedOn}`}
            </Row>
            {this.getAuthorName()}
          </Row>
          <Row span={24}>
            { asset.Prototype && marketplace?.userType !== 'viewer' ? (
              <KonyButton
                type="appPreview"
                title="PREVIEW"
                className={style.previewButton}
                href={`https://www.kony.com/marketplace/app_preview?apptolaunch=${asset.Prototype}`}
              />
            ) : null }
            <AssetDownloadButton
              {...asset}
              title={this.props.title}
              url={this.props.url}
              isMobile
              isCoreAsset={this.props.isCoreAsset}
              isContactUs={this.props.isContactUs}
              isNotified={this.props.isNotified}
              itemId={this.props.itemId}
            />
          </Row>
        </Col>
      </Row>
    );
  }
}

DetailMobileMeta.propTypes = {
  asset: PropTypes.object,
};

DetailMobileMeta.defaultProps = {
  asset: {},
};

const mapStateToProps = ({ marketplace }) => ({ marketplace });

export default connect(mapStateToProps)(DetailMobileMeta);
