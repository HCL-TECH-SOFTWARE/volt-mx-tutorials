import React from 'react';
import PropTypes from 'prop-types';
import _forEach from 'lodash/forEach';
import style from './style.scss';
import KonyButton from '../KonyButton';
import { replaceAll, secondsToTime } from '../../utils';

const JSONToCSVConverter = (JSONData, Columns, ShowLabel, fileNameSuffix) => {
  const arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
  let CSV = '';
  const indices = [];
  if (ShowLabel) {
    let row = '';
    _forEach(Columns, (index) => {
      row += `${index.title},`;
      indices.push(index.dataIndex);
    });
    row = row.slice(0, -1);
    CSV += `${row}\r\n`;
  }

  _forEach(arrData, (data) => {
    let row = '';
    _forEach(indices, (index) => {
      if (index === 'output') row += replaceAll(data[index], ',', '; ');
      else if (index === 'searchDuration') row += secondsToTime(replaceAll(data[index], '.00', ''));
      else row += data[index];
      row += ', ';
    });
    row.slice(0, row.length - 1);
    CSV += `${row}\r\n`;
  });

  if (CSV === '') {
    return;
  }
  const fileName = `Marketplace_Report_${fileNameSuffix}`;
  const uri = `data:text/csv;charset=utf-8,${escape(CSV)}`;

  const link = document.createElement('a');
  link.href = uri;
  link.style = 'visibility:hidden';
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ExportTableToCSV = ({
  title,
  data,
  columns,
  fileNameSuffix,
}) => {
  if (data.length > 0) {
    return (
      <KonyButton
        className={style.exportButton}
        title={title}
        type="action"
        color="blue"
        onClick={e => JSONToCSVConverter(data, columns, true, fileNameSuffix)}
      />
    );
  }
  return null;
};

ExportTableToCSV.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  columns: PropTypes.array,
  fileNameSuffix: PropTypes.string,
};

ExportTableToCSV.defaultProps = {
  title: 'Export as Excel',
  data: [],
  columns: [],
  fileNameSuffix: 'analytics',
};

export default ExportTableToCSV;
