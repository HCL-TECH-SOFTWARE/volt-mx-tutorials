import React from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import style from './style.scss';
import KonySearch from '../KonySearch/';

const MarketplaceHeader = ({ title, subTitle ,selectedParams}) => (
  <Row className={style.siteHeader} >
    <Col xs={0} sm={0} md={24} lg={24}>
      <h1 className={style.headerTitle}>{title}</h1>
      <h2 className={style.headersubTitle}>{subTitle}</h2>
    </Col>
    <Col span={24}>
      <KonySearch selectedFilters={selectedParams} />
    </Col>
  </Row>
);

MarketplaceHeader.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
};

MarketplaceHeader.defaultProps = {
  title: 'HCL Volt MX Tutorials',
  subTitle: 'New Assets, New Possibilities',
};

export default MarketplaceHeader;
