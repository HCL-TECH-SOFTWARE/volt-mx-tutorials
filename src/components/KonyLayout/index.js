import React, { Component } from "react";
import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { baseURL, basecampBaseURL } from '../../config/settings';
import style from "./style.scss";

class KonyLayout extends Component {
  componentDidMount() {
    const userId = (this.props.marketplace.userId === undefined ||
      this.props.marketplace.userId === null ) ? 0 : this.props.marketplace.userId;
    window.dataLayer.push({
      'userId': userId,
      'event': 'trackUser'
    })
    localStorage.setItem('startTime', new Date().getTime());
  }

  getProfileUrl() {
    if (this.props.marketplace.basecampUserInfo
      && this.props.marketplace.basecampUserInfo !== null
      && this.props.marketplace.basecampUserInfo.id) {
      return `${basecampBaseURL}s/profile/${this.props.marketplace.basecampUserInfo.id}`;
    }
    return '/';
  }

  buildMenuList = (menu, isLogin, cloudAccounts, privateModeratorMenu, hikeAdminMenu, moderatorMenu, url) => {
    if (!menu) {
      return undefined;
    }
    let tempMenu = [...menu];
    if(isLogin) {
      tempMenu.push({
        id: 450,
        title: "user",
        parent: 0,
        subMenu: [{
          id: 401,
          title: "Profile",
          url: this.getProfileUrl(),
          weight: 1,
          submenuItems: []
        },
        {
          id: 402,
          title: "Dashboard",
          url: `${baseURL}marketplace/dashboard/`,
          weight: 2,
          submenuItems: []
        },
        {
          id: 404,
          title: "Upload Asset",
          url: `${baseURL}marketplace/import/`,
          weight: 2,
          submenuItems: []
        },
        {
          id: 403,
          title: "Logout",
          url: `/oauth/logout?destination=${url ? encodeURIComponent(url.asPath) : '/'}`,
          weight: 4,
          submenuItems: []
        },
      ]
      });
      if (cloudAccounts.length > 0) {
        tempMenu[tempMenu.length - 1].subMenu.splice(2, 0, {
          id: 550,
          title: "Cloud Accounts",
          parent: 450,
          url: '#',
          subMenu: [...cloudAccounts],
        });
      }
      if (privateModeratorMenu.length > 0
        || (moderatorMenu.subMenu && moderatorMenu.subMenu.length > 0)) {
        tempMenu[tempMenu.length - 1].subMenu.splice(2, 0, {
          id: 551,
          title: 'Admin',
          parent: 450,
          url: '#',
          subMenu: [moderatorMenu],
        });
      }
      if (hikeAdminMenu.length > 0) {
        tempMenu[tempMenu.length - 1].subMenu.splice(2, 0, {
          id: 552,
          title: 'Manage Hikes',
          url: `${baseURL}tours/list`,
        });
      }
    } else {
      tempMenu.push({
        id: 450,
        title: "Login",
        parent: 0,
        url:`/oauth/login?destination=${url ? encodeURIComponent(url.asPath) : '/'}`,
        subMenu: []
      })
    }

    return tempMenu;
  };

  getUserName(marketplace) {
    if(marketplace.user && marketplace.user.whoami)
      return `${marketplace.user.whoami.first_name} ${marketplace.user.whoami.last_name}`;
    return 'user';
  }

  render() {
    const {
      config, marketplace, url, children,
    } = this.props;
    const {
      isLogin, cloudAccounts, privateModeratorMenu, hikeAdminMenu, moderatorMenu, isVizWeb, isVizApp,
    } = marketplace;
    return (
      <div className={style.appRoot}>
        <SiteHeader
          url={url}
          menuList={this.buildMenuList(config.menu,
            isLogin,
            cloudAccounts,
            privateModeratorMenu,
            hikeAdminMenu,
            moderatorMenu,
            url)}
          name={marketplace.isLogin ? this.getUserName(marketplace) : 'user'}
        />
        <div className={style.container}>{children}</div>
        <div className={`${style.divider} ${isVizWeb || isVizApp ? style.hide : null}`} />
        <SiteFooter content={config.footer} />
      </div>
    );
  }
}

KonyLayout.propTypes = {
  title: PropTypes.string,
};

KonyLayout.defaultProps = {
  title: 'Header',
};

const mapStateToProps = ({ marketplace }) => ({ marketplace });

export default connect(mapStateToProps)(KonyLayout);
