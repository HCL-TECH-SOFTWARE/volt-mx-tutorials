import React, { useState } from "react";
import { Menu, Icon } from "antd";

const { SubMenu } = Menu;

const ExportTabSwitcher = ({ changeTab }) => {
  const [current, setCurrent] = useState("json");

  const handleClick = (e) => {
    changeTab(e.key);
    setCurrent(e.key);
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Menu.Item key="json">
        <Icon type="code" />
        JSON Values
      </Menu.Item>
    </Menu>
  );
};

export default ExportTabSwitcher;
