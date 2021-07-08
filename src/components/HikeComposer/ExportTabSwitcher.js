import React, { useState } from 'react';
import { Menu, Icon } from 'antd';
import i18next from 'i18next';
import { locales } from '../../../i18n';

const ExportTabSwitcher = ({ changeTab }) => {
  const [current, setCurrent] = useState('json');

  const handleClick = (e) => {
    changeTab(e.key);
    setCurrent(e.key);
  };

  return (
    <Menu style={{ overflowX: 'auto' }} onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Menu.Item key="json">
        <Icon type="code" />
        JSON Values
      </Menu.Item>
      {locales.map(locale => (
        <Menu.Item key={locale}>
          <Icon type="code" />
          {i18next.t(locale)}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default ExportTabSwitcher;
