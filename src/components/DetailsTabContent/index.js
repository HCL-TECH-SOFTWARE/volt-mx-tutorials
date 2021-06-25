import React from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import style from './style.scss';
import DetailsMetaData from './DetailsMetaData';
import ScreenshotPreview from './ScreenshotPreview';

const DetailsTabContent = asset => (
  <Row>
    <Col span={12} sm={0} xs={0} md={0} lg={12} className={style.screenshotWrapper}>
      {asset.Screenshots ? (<ScreenshotPreview title={asset.title} slides={asset.Screenshots} />) : null}
    </Col>
    <Col span={12} sm={24} xs={24} md={24} lg={12} className={style.metadataWrapper}>
      <DetailsMetaData {...asset} />
    </Col>
  </Row>
);

DetailsTabContent.propTypes = {
  asset: PropTypes.object,
};

DetailsTabContent.defaultProps = {
  asset: {},
};

export default DetailsTabContent;
