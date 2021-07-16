import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'antd';
import i18next from '../../../i18n';

const propTypes = {
  setView: PropTypes.func.isRequired,
  current: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const PreviewSwitcher = ({ setView, current }) => (
  <Menu
    style={{ background: '#f3f2f2' }}
    onClick={setView}
    selectedKeys={current}
    mode="horizontal"
  >
    <Menu.Item key="card">
      <Icon type="border" />
      {i18next.t('Card Preview')}
    </Menu.Item>
    <Menu.Item key="tour">
      <Icon type="file-image" />
      {i18next.t('Tour Preview')}
    </Menu.Item>
  </Menu>
);

PreviewSwitcher.propTypes = propTypes;
export default PreviewSwitcher;
