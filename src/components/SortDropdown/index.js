import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
import style from './style.scss';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

class SortDropdown extends Component {
  handleClick = (e) => {
  this.props.sort(e.key);
  };

  menu = () => (
    <Menu
      defaultSelectedKeys={[this.props.selected || 'popular']}
      className={style.sortDropdown}
      selectable
      onClick={e => this.handleClick(e)}
    >
      { this.props.menuItems.map(item => (
        <Menu.Item
          key={item.id}
          className="sortDropdownListItem"
        >
          {item.title}
        </Menu.Item>
      ))}
    </Menu>
  );

  render() {
    return (
      <div id="sortDropdown" className={`${style.sortDropdownWrapper} ${this.props.className || null}`}>
        <Dropdown
          overlay={this.menu()}
          placement="bottomRight"
          trigger={['click']}
          getPopupContainer={() => document.getElementById('sortDropdown')}
        >
          <a className={`ant-dropdown-link ${style.sortTitle}`} href="#">
            <img
              src={`${publicRuntimeConfig.asset}/static/dist/images/icons/sortIcon.svg`}
              alt="Sort icon"
              className={style.sortAmountDownIcon}
            />
            Sort
            <img
              src={`${publicRuntimeConfig.asset}/static/dist/images/icons/navBarArrow.svg`}
              alt="Sort icon"
              className={style.angleDownIcon}
            />
          </a>
        </Dropdown>
      </div>
    );
  }
}

SortDropdown.propTypes = {
  title: PropTypes.string,
};

SortDropdown.defaultProps = {
  title: 'Header',
};

export default SortDropdown;
