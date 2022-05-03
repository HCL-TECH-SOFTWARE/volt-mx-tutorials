import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'antd';
import i18next from '../../../i18n';

const propTypes = {
  setView: PropTypes.func.isRequired,
  current: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const FormSwitcher = ({ setView, current }) => (
  <Menu
    style={{ background: '#f3f2f2' }}
    onClick={setView}
    selectedKeys={current}
    mode="horizontal"
  >
    <Menu.Item key="new">
      <Icon type="plus" />
      {i18next.t('New Hike')}
    </Menu.Item>
  </Menu>
);

FormSwitcher.propTypes = propTypes;
export default FormSwitcher;
