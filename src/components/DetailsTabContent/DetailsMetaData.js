import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Select from 'antd/lib/select';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import _map from 'lodash/map';
import { connect } from 'react-redux';
import { Base64 } from 'js-base64';
import { getUrl } from '../../utils/initialize';
import style from './style.scss';
import DeveloperGuide from './DeveloperGuide';
import CodeExplorer from './CodeExplorer';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const { Option } = Select;

class DetailsMetaData extends Component {
  getAssetVersion(asset) {
    if (asset.totalAssets === 1) {
      return `Asset Version: ${asset.Version}`;
    }
    return (
      <React.Fragment>
        <span>Asset Version:</span>
        <Select
          className={style.selector}
          dropdownClassName={style.dropdown}
          defaultValue={
            Number(asset.metaDetails.latest_published_asset)
          }
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
            _map(asset
              .metaDetails
              .sorted_option, (k, v) => <Option key={Number(v)} value={Number(v)}>{k}</Option>)
          }
        </Select>
      </React.Fragment>
    );
  }

  handleChange(value) {
    this.props.changeAsset(value);
  }

  authorURL = () => {
    const { isVizWeb } = this.props.marketplace;
    const { AuthorName, AuthorUID } = this.props;
    const encodedAuthor = Base64.encode(`${AuthorName}::${AuthorUID}`);
    return getUrl(`/author/${encodedAuthor}`, null, isVizWeb);
  };

  getAuthorName() {
    if (this.props.AuthorName) {
      return (
        <Col span={24} className={`${style.publishDate} assetAuthor`} sm={0} xs={0} md={0} lg={24}>
          By:
          {' '}
          <Link href={this.authorURL()}>{this.props.AuthorName}</Link>
        </Col>);
    }
    return null;
  }

  render() {
    const asset = this.props;
    const { marketplace } = asset;
    const isPrototypeAvailable = asset.Prototype && asset.Prototype !== '' && asset.Prototype !== null && asset?.userType !== 'viewer';
    return (
      <Row>
        <Col span={24} className={style.assetVersion} sm={0} xs={0} md={0} lg={24}>
          {
            this.getAssetVersion(asset)
          }
          {
            asset.github_repository_url
            && asset.github_repository_url !== ''
              ? <CodeExplorer link={asset.github_repository_url} />
              : null
          }
        </Col>
        <Col span={24} className={style.publishDate} sm={0} xs={0} md={0} lg={24}>
          {`Last Published: ${asset.PublishedOn}`}
        </Col>
        {this.getAuthorName()}
        <Col span={24} className={style.desc}>
          {asset.Description}
        </Col>
        <Col span={24} className={`${isPrototypeAvailable ? '' : style.moveUp} ${style.developerGuideWrapper}`}>
          <DeveloperGuide
            {...asset}
            userType={marketplace?.userType}
            viz={marketplace.isVizApp || marketplace.isVizWeb}
          />
        </Col>
        <Col span={24} className={style.assetDetails}>
          <div
            dangerouslySetInnerHTML={{ __html: asset.Details }}
            className={style.assetDetails}
          />
        </Col>
        {
          asset.ExternalLinks && asset.ExternalLinks.length > 0
            ? (
              <Col span={24} className={`${style.assetDetails} ${style.externalLinks}`}>
                <h3>Resources</h3>
                <ul>
                  {
                    asset.ExternalLinks.map(({ title, url }) => (
                      <li>
                        <a
                          target="_blank"
                          key={title}
                          href={url}
                          rel="noreferrer"
                        >
                        {title}
                      </a>
                    </li>
                  ))
                  }
                </ul>
              </Col>)
            : null
        }
      </Row>
    );
  }
}

DetailsMetaData.propTypes = {
  asset: PropTypes.object,
};

DetailsMetaData.defaultProps = {
  asset: {},
};

const mapStateToProps = ({ marketplace }) => ({ marketplace });

export default connect(mapStateToProps)(DetailsMetaData);
