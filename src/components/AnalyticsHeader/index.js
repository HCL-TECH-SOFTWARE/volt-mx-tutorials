import React from 'react';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './style.scss';
import AnalyticsSearch from '../AnalyticsSearch';

export const AnalyticsHeader = ({
  title, subTitle, filterData, placeholder, search,
}) => (
  <Row className={style.siteHeader}>
    <Col span={12}>
      <h1 className={style.headerTitle}>{title}</h1>
      <h2 className={style.headersubTitle}>{subTitle}</h2>
    </Col>
    {
      search
        ? (
          <Col span={12}>
            <AnalyticsSearch
              filterData={filterData}
              placeholder={placeholder}
            />
          </Col>
        )
        : null
    }
  </Row>
);

AnalyticsHeader.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  search: PropTypes.bool,
  filterData: PropTypes.func,
  placeholder: PropTypes.string,
};

AnalyticsHeader.defaultProps = {
  title: 'HCL Volt MX Tutorials',
  subTitle: 'New Assets, New Possibilities',
  search: false,
  filterData: () => {},
  placeholder: '',
};

const mapStateToProps = ({ marketplace }) => ({ marketplace });

export default connect(mapStateToProps)(AnalyticsHeader);
