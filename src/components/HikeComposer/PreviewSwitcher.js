import React, { useState } from "react";
import { Menu, Icon } from "antd";

const { SubMenu } = Menu;

const PreviewSwitcher = ({ setView, current }) => {
  return (
    <Menu onClick={setView} selectedKeys={current} mode="horizontal">
      <Menu.Item key="new">
        <Icon type="plus" />
        New Hike
      </Menu.Item>
      {/* <Menu.Item key="edit">
        <Icon type="edit" />
        Edit Hike
      </Menu.Item> */}
    </Menu>
  );
};

export default FormSwitcher;
