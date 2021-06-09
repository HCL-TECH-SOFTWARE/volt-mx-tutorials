import React from "react";
import { Menu, Icon } from "antd";

const { SubMenu } = Menu;

export default class FormSwitcher extends React.Component {
  state = {
    current: "new",
  };

  handleClick = (e) => {
    console.log("click ", e);
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
      >
        <Menu.Item key="new">
          <Icon type="plus" />
          New Hike
        </Menu.Item>
        <Menu.Item key="edit">
          <Icon type="edit" />
          Edit Hike
        </Menu.Item>
      </Menu>
    );
  }
}
