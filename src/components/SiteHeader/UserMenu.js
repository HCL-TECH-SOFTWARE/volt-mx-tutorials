import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Dropdown from 'antd/lib/dropdown';
import { connect } from 'react-redux';
import Menu from 'antd/lib/menu';
import style from './style.scss';
import { basecampBaseURL, baseURL } from '../../config/settings';
import KonyGravatar from '../KonyGravatar';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const { SubMenu } = Menu;

class UserMenu extends Component {
  getProfileImage() {
    if (
      this.props.marketplace.basecampUserInfo
      && this.props.marketplace.basecampUserInfo !== null
      && this.props.marketplace.basecampUserInfo.photo
    ) {
      return `${basecampBaseURL}${this.props.marketplace.basecampUserInfo.photo}`;
    }
    return `${publicRuntimeConfig.asset}/static/dist/images/noGravatar.png`;
  }

  getMenu(item) {
    const defaultItem = item.title === 'Marketplace' ? '#' : '';
    if (this.props.marketplace.isLogin || item.subMenu.length > 0) {
      return (
        <div id="userDropdown">
          <Dropdown
            overlay={this.menu}
            placement="bottomRight"
            trigger={['click']}
            getPopupContainer={() => document.getElementById('userDropdown')}
          >
            <a className={`ant-dropdown-link ${style.dropdownClick}`} href="#">
              <KonyGravatar src={this.getProfileImage()} />
            </a>
          </Dropdown>
        </div>
      );
    }
    return (
      <a className={style.loginLink} href={`${item.url}${defaultItem}`}>
        {item.title}
      </a>
    );
  }

  static renderCloudMenu(clouds, url) {
    return clouds.map(item => (
      <Menu.Item
        key={item?.account_id}
        className={`${String(item?.account_id) === url.query.cloudId ? style.selected : ''} ${
          style.cloudList
        }`}
      >
        <a href={`/cloud/${item?.account_id}`}>
          <Row>
            <Col span={4}>
              <img src={`${publicRuntimeConfig.asset}/static/dist/images/cloud.svg`} alt="cloud" className={style.icon} />
            </Col>
            <Col span={18} className={style.cloudMenuItemMeta}>
              <h3>{item.account_title}</h3>
              <h4>{`Account ID: ${item?.account_id}`}</h4>
            </Col>
          </Row>
        </a>
      </Menu.Item>
    ));
  }

  menu = (
    <Menu defaultSelectedKeys={['3']} mode="inline" className={`${style.subMenu} mpUserMenu`}>
      {this.props.menu.subMenu.map(item => this.renderMenu(item))}
    </Menu>
  );

  renderMenu(item) {
    if (item.title === 'Cloud Accounts') {
      return (
        <SubMenu key={item.id} title={item.title} className={style.cloudMenu}>
          {UserMenu.renderCloudMenu(item.subMenu, this.props.url)}
        </SubMenu>
      );
    }

    if (item.title === 'Admin') {
      return (
        <SubMenu key={item.id} title={item.title} className={style.cloudMenu}>
          {UserMenu.renderAdminMenu(item.subMenu)}
        </SubMenu>
      );
    }

    return (
      <Menu.Item key={item.id}>
        <a href={item.url}>{item.title}</a>
      </Menu.Item>
    );
  }

  render() {
    return (
      <li className={`ant-menu-item ${style.userMenuItem}`} key="7">
        {this.getMenu(this.props.menu)}
      </li>
    );
  }

  static getAdminSubMenu(subItem) {
    if(subItem.title === 'Marketplace Analytics Dashboard') {
      return (<a href="/analytics">{subItem.title}</a>);
    } else if (subItem.title === 'Marketplace Search Statistics') {
      return (<a href="/analytics/search">{subItem.title}</a>);
    }
    return (<a href={`${baseURL}${subItem.url}`}>{subItem.title}</a>);
  }

  static renderAdminMenu(item) {
    const { subMenu, title } = item[0];
    return (
      <SubMenu key={item.id} title={title} className={`${style.cloudMenu} ${style[title]}`}>
        {
          subMenu.length > 0
            ? subMenu.map(subItem => (
              <Menu.Item key={subItem.id} className={style.subMenuListItem}>
                {
                  UserMenu.getAdminSubMenu(subItem)
                }
              </Menu.Item>
            ))
            : null
        }
      </SubMenu>
    );
  }
}

UserMenu.propTypes = {};

UserMenu.defaultProps = {};

const mapStateToProps = ({ marketplace }) => ({ marketplace });

export default connect(mapStateToProps)(UserMenu);
