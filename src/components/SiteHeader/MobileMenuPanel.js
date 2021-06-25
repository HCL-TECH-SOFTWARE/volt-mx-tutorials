import React, { Component } from 'react';
import Menu from 'antd/lib/menu';
import style from './style.scss';

const { SubMenu } = Menu;

class MobileMenuPanel extends Component {
  menuItem = (item) => {
    const selected = (item.title === 'Marketplace') ? `${style.selectedItem} ant-menu-item-selected` : '';
    const defaultItem = (item.title === 'Marketplace') ? '#' : '';
    const getItemTitle = item.title !== 'user' ? item.title : this.props.name || 'User';
    const { cloudId } = this.props.url.query;
    if (item.subMenu.length > 0) {
      return (
        <SubMenu
          key={item.id}
          title={getItemTitle}
          className={style.mobileMenuItems}
        >
          {
            item
              .subMenu
              .map(sub => (
                sub.title === 'Cloud Accounts' && this.props.cloudMenu !== 0
                  ? (
                    <SubMenu key={sub.id} title={sub.title} className={style.cloudMenu}>
                      {
                        this.props.cloudMenu.map(menu => (
                          <Menu.Item key={menu?.account_id} className={`${style.cloudItem} ${cloudId && String(cloudId) === String(menu?.account_id) ? style.cloudSelectedItem : ''}`}>
                            <a href={`/cloud/${menu?.account_id}`}>
                              {`${menu.account_title} (${menu?.account_id})`}
                            </a>
                          </Menu.Item>
                        ))
                      }
                    </SubMenu>
                  )
                  : sub.title !== 'Admin'
                    ? (
                      <Menu.Item key={sub.id}>
                        <a href={sub.url}>{sub.title}</a>
                      </Menu.Item>
                    )
                    : null
              ))
          }
        </SubMenu>
      );
    }

    return (
      <Menu.Item className={`${style.mobileMenuItems} ${selected}`} key={item.id}>
        <span><a href={`${item.url}${defaultItem}`}>{item.title}</a></span>
      </Menu.Item>
    );
  }

  renderMobileMenus = () => {
    if (this.props.menus !== undefined) {
      return this.props.menus.map(item => this.menuItem(item));
    }
  }

  render() {
    return (
      <Menu
        defaultSelectedKeys={['3']}
        mode="inline"
        className={style.menu}
      >
        {this.renderMobileMenus()}
      </Menu>
    );
  }
}

export default MobileMenuPanel;
