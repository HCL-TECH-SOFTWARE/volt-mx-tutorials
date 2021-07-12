import React, { useState } from "react";
import { Menu, Icon } from "antd";
import i18next from 'i18next';

const { SubMenu } = Menu;

const PreviewSwitcher = ({ setView, current }) => {
  return (
    <Menu
      style={{ background: "#f3f2f2" }}
      onClick={setView}
      selectedKeys={current}
      mode="horizontal"
    >
      <Menu.Item key="card">
        <Icon type="border" />
        {i18next.t("Card Preview")}
      </Menu.Item>
      <Menu.Item key="tour">
        <Icon type="file-image" />
        {i18next.t("Tour Preview")}
      </Menu.Item>
    </Menu>
  );
};

export default PreviewSwitcher;
