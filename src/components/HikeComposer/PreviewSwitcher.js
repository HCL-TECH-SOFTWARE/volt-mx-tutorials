import React, { useState } from "react";
import { Menu, Icon } from "antd";

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
        Card Preview
      </Menu.Item>
      <Menu.Item key="tour">
        <Icon type="file-image" />
        Tour Preview
      </Menu.Item>
    </Menu>
  );
};

export default PreviewSwitcher;
