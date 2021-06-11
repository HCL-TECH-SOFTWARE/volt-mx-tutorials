import React, { useState } from "react";
import { Menu, Icon } from "antd";

const { SubMenu } = Menu;

const ExportTabSwitcher = ({ changeTab }) => {
  const [current, setCurrent] = useState("info");

  const handleClick = (e) => {
    console.log("click ", e.key);
    changeTab(e.key);
    setCurrent(e.key);
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Menu.Item key="info">
        <Icon type="info" />
        Info
      </Menu.Item>
      <Menu.Item key="json">
        <Icon type="code" />
        JSON Values
      </Menu.Item>
    </Menu>
  );
};

export default ExportTabSwitcher;
