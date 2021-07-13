import React, { useState } from "react";
import { Menu, Icon } from "antd";
import i18next from 'i18next';

const { SubMenu } = Menu;

const FormSwitcher = ({ setView, current }) => {
  return (
    <Menu
      style={{ background: "#f3f2f2" }}
      onClick={setView}
      selectedKeys={current}
      mode="horizontal"
    >
      <Menu.Item key="new">
        <Icon type="plus" />
        {i18next.t("New Hike")}
      </Menu.Item>
      {/* <Menu.Item key="edit">
        <Icon type="edit" />
        Edit Hike
      </Menu.Item> */}
    </Menu>
  );
};

export default FormSwitcher;
