import Table from 'antd/lib/table';
import React from 'react';
import PropTypes from 'prop-types';
import style from './style.scss';

const AnalyticsFilterTable = ({
  showPagination, columns, data, onRowClick, onChange, loading
}) => (
  <Table
    columns={columns}
    dataSource={data}
    bordered
    className={`${style.dataTable} analyticsTable`}
    onChange={onChange}
    loading={loading}
    pagination={
      showPagination
        ? {
          total: data && data.length ? data.length : 0,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSize: 12,
        } : false
    }
    onRow={(record, rowIndex) => ({
      onClick: (event) => {
        onRowClick(record);
      },
    })}
  />
);

AnalyticsFilterTable.propTypes = {
  showPagination: PropTypes.bool,
  onRowClick: PropTypes.func,
  columns: PropTypes.array,
  data: PropTypes.array,
  onChange: PropTypes.func,
  loading: PropTypes.bool,
};

AnalyticsFilterTable.defaultProps = {
  showPagination: false,
  onRowClick: () => {},
  onChange: () => {},
  columns: [],
  data: [],
  loading: false,
};

export default AnalyticsFilterTable;
