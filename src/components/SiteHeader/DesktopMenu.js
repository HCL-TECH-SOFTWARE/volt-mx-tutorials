import React, { Component } from "react";
import Icon from "antd/lib/icon";
import Menu from 'antd/lib/menu';
import Dropdown from "antd/lib/dropdown";
import UserMenu from './UserMenu';
import style from "./style.scss";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export default class DesktopMenu extends Component {
  subMenuItem = item => (
    <Menu.Item key={item.id}>
      <a href={item.url}>{item.title}</a>
    </Menu.Item>
  );
  subMenuItems = items => (
    <Menu className={style.subMenu} style={{ top: 10 }}>
      {items.map(item => this.subMenuItem(item))}
    </Menu>
  );

  menuItem = item => {
    const selected = item.title === "Marketplace" ? style.selected : "";
    const defaultItem = item.title === "Marketplace" ? "#" : "";
    if (item.subMenu.length > 0) {
      return (
        <Menu.Item className={`${style.menuItem} ${selected}`} key={item.id}>
          <Dropdown
            overlay={this.subMenuItems(item.subMenu)}
            trigger={["click"]}
            placement="bottomCenter"
          >
            <a className={style.dropdownLink} href="#">
              {item.title} <img className={style.dropdownCaret} src={`${publicRuntimeConfig.asset}/static/dist/images/icons/navBarArrow.svg`} alt="Sort Icon" />
            </a>
          </Dropdown>
        </Menu.Item>
      );
    }
    return (
      <Menu.Item className={`${style.menuItem} ${selected}`} key={item.id}>
        <a href={`${item.url}${defaultItem}`}>{item.title}</a>
      </Menu.Item>
    );
  };

  renderMenu(item) {
    const menuTitle = item.title.toLowerCase();
    if (menuTitle === 'login' || menuTitle === 'user')
      return <UserMenu menu={item} key={item.title} url={this.props.url} />;
    return this.menuItem(item);
  }

  render() {
    if (!this.props.menuList) {
      return "No Menu items";
    }
    return (
      <Menu
        mode="horizontal"
        defaultSelectedKeys={["7"]}
        className={style.menuBar}
      >
        {
          this
            .props
            .menuList
            .map(
              item =>
                this.renderMenu(item)
            )
        }
      </Menu>
    );
  }
}
