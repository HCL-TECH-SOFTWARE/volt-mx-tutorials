import React from 'react';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import PropTypes from 'prop-types';
import style from './style.scss';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const getIcon = (name) => {
  switch (name) {
    case 'download':
      return (
        <img
          src={`${publicRuntimeConfig.asset}/static/dist/images/icons/download.png`}
          alt="Analytics icon"
          className={style.analyticsIcon}
        />
      );
    case 'import':
      return (
        <img
          src={`${publicRuntimeConfig.asset}/static/dist/images/icons/import.png`}
          alt="Analytics icon"
          className={style.analyticsIcon}
        />
      );
    case 'component':
      return (
        <img
          src={`${publicRuntimeConfig.asset}/static/dist/images/icons/component.png`}
          alt="Analytics icon"
          className={style.analyticsIcon}
        />
      );
    default:
      return (
        <img
          src={`${publicRuntimeConfig.asset}/static/dist/images/icons/import.png`}
          alt="Analytics icon"
          className={style.analyticsIcon}
        />
      );
  }
};

const AnalyticsMiniPanel = ({ title, count, icon, className }) => (
  <Row className={`${style.base} ${className}`}>
    <Col className={style.titleIcon}>
      <Col span={22}>
        <h2>
          {title}
        </h2>
      </Col>
      <Col span={2}>
        {getIcon(icon)}
      </Col>
    </Col>
    <Col span={24}>
      <h3>
        {count}
      </h3>
    </Col>
  </Row>
);

AnalyticsMiniPanel.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
  icon: PropTypes.string,
};

AnalyticsMiniPanel.defaultProps = {
  title: '',
  count: 0,
  icon: '',
};

export default AnalyticsMiniPanel;
