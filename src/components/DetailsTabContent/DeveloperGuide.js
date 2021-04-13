import React from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import _size from 'lodash/size';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Icon from 'antd/lib/icon';
import QRCode from 'qrcode.react';
import style from './style.scss';
import QRCodePopup from '../QRCodePopup';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const DeveloperGuide = (asset) => {
  const getRequirements = (item, isViz) => {
    switch (item) {
      case 'VisualizerEnterprise':
        return (
          isViz ? 'Visualizer Classic'
            : (
              <a
                href="http://forms.kony.com/appplatform-en-demo.html"
                title="Visualizer Classic"
                target="_blank"
                rel="noreferrer"
              >
                Visualizer Classic
              </a>
            )
        );
      case 'Mobilefabric':
        return (
          isViz ? 'Kony Fabric'
            : (
              <a
                href="http://forms.kony.com/appplatform-en-demo.html"
                title="Kony Fabric"
                target="_blank"
                rel="noreferrer"
              >
                Kony Fabric
              </a>
            )
        );
      default:
        return null;
    }
  };

  const renderIcons = item => (
    <img
      src={`${publicRuntimeConfig.asset}/static/dist/images/icons/${item}_platform.svg`}
      alt={item}
      className={style.dgIcon}
    />
  );

  const areAllValuesFalse = heading => _size(_filter(heading, (key, val) => key !== false)) <= 0;
  return (
    <Row>
      <Col span={24}>
        {(asset.Prototype && asset.Prototype !== '' && asset.Prototype !== null && asset?.userType !== 'viewer') ? (
          <Col
            span={6}
            sm={24}
            xs={24}
            md={6}
            lg={6}
            xl={0}
            className={style.innerTabWrapper}
          >
            <div className={style.dgHeading}>App Preview Code</div>
            <Col sm={0} xs={0} md={0} lg={24} className={style.dgAppCode}>{asset.Prototype}</Col>
            <Col sm={24} xs={24} md={24} lg={0} className={style.dgAppCodeMobile}>
              <a
                href={`https://www.kony.com/marketplace/app_preview?apptolaunch=${asset.Prototype}`}
                title="launch app in visualizer"
                rel="noreferrer"
              >
                {asset.Prototype}
              </a>
            </Col>
          </Col>) : null
        }
        {!areAllValuesFalse(asset.ProductRequirements) ? (
          <Col
            span={6}
            sm={24}
            xs={24}
            md={6}
            lg={6}
            xl={8}
            className={style.innerTabWrapper}
          >
            <div className={style.dgHeading}>Requirements</div>
            <div className={style.dgContent}>
              <ul>
                {
                  _map(asset.ProductRequirements, (key, value) => (key ? <li key={value} className={style.requirements}>{getRequirements(value, asset.viz)}</li> : ''))
                }
              </ul>
            </div>
          </Col>) : null}

        {!areAllValuesFalse(asset.SupportChannel) ? (
          <Col
            span={6}
            sm={24}
            xs={24}
            md={6}
            lg={6}
            xl={8}
            className={style.innerTabWrapper}
          >
            <div className={style.dgHeading}>Devices</div>
            <div className={style.iconWrapper}>
              <ul>
                {
                  _map(asset.SupportChannel, (key, value) => (key ? <li key={value}>{renderIcons(value)}</li> : ''))
                }
              </ul>
            </div>
          </Col>) : null }
        {(!areAllValuesFalse(asset.SupportedPlatform)
          && asset?.userType !== 'viewer') ? (
            <Col
              span={6}
              sm={24}
              xs={24}
              md={6}
              lg={6}
              xl={8}
              className={style.innerTabWrapper}
            >
              <div className={style.dgHeading}>Platforms</div>
              <div className={style.iconWrapper}>
                <ul>
                  {
                    _map(asset.SupportedPlatform, (key, value) => (key ? <li key={value}>{renderIcons(value)}</li> : ''))
                  }
                </ul>
              </div>
            </Col>) : null }
      </Col>
      <Col sm={0} xs={0} md={0} lg={0} xl={24}>
        {(asset.Prototype && asset.Prototype !== '' && asset.Prototype !== null && asset?.userType !== 'viewer') ? (
          <Row className={style.appPreviewWrapper}>
            <Col sm={0} xs={0} md={0} lg={0} xl={24}>
              <QRCodePopup prototype = {asset.Prototype}/>
            </Col>
            <Col
              sm={0}
              xs={0}
              md={0}
              lg={0}
              xl={8}
              className={style.appPreviewTabWrapper}
            >
              <div className={style.dgHeading}>App Preview Code</div>
              <Col sm={0} xs={0} md={0} lg={24} className={style.dgAppCode}>{asset.Prototype}</Col>
              <Col sm={24} xs={24} md={24} lg={0} className={style.dgAppCodeMobile}>
                <a
                  href={`https://www.kony.com/marketplace/app_preview?apptolaunch=${asset.Prototype}`}
                  title="launch app in visualizer"
                  rel="noreferrer"
                >
                  {asset.Prototype}
                </a>
              </Col>
            </Col>
            <Col
              sm={0}
              xs={0}
              md={0}
              lg={0}
              xl={8}
              className={`${style.appPreviewTabWrapper} `}
            >
              <div className={style.dgHeading}>Scan with App Viewer</div>
              <Col span={24} className={style.dgAppCodeMobile}>
                <QRCode
                  value={JSON.stringify({previewCode: asset.Prototype})}
                  size={60}
                />
              </Col>
            </Col>
          </Row>) : null
        }
      </Col>
    </Row>
  );
};

DeveloperGuide.propTypes = {
  asset: PropTypes.object,
};

DeveloperGuide.defaultProps = {
  asset: {},
};

export default DeveloperGuide;
