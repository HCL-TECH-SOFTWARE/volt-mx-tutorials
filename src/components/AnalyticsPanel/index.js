import React from 'react';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import PropTypes from 'prop-types';
import style from './style.scss';
import { truncateAdvance } from '../../utils';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const AnalyticsPanel = ({ data, title, className }) => (
  <Row className={`${style.base} ${className}`}>
    <Col className={style.title}>
      <h2>
        TOP 5
      </h2>
    </Col>
    <Col>
      <h2>
        {title}
      </h2>
    </Col>
    <Col span={24} className={style.wrapper}>
      {
        data && data.length > 0 ? data.map(item => (
          <Row className={style.itemWrapper}>
            <Col span={16}>
              {
                truncateAdvance(item.title, 30)
              }
            </Col>
            <Col span={4}>
              <img
                src={`${publicRuntimeConfig.asset}/static/dist/images/icons/like.svg`}
                alt="icon"
                className={style.statsIcon}
              />
              {
                item.likes
              }
            </Col>
            <Col span={4}>
              <img
                src={`${publicRuntimeConfig.asset}/static/dist/images/icons/downloadBlue.png`}
                alt="icon"
                className={style.statsIcon}
              />
              {
                item.downloads
              }
            </Col>
          </Row>
        )) : 'No Data found for current Selected Dates'
      }
    </Col>
  </Row>
);

AnalyticsPanel.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
};

AnalyticsPanel.defaultProps = {
  title: '',
  data: [],
};

export default AnalyticsPanel;
