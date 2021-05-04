import React, { Component } from 'react';
import Layout from 'antd/lib/layout';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Link from 'next/link';
import { connect } from 'react-redux';
import _filter from 'lodash/filter';
import _last from 'lodash/last';
import style from './style.scss';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const { Header } = Layout;

class SiteHeader extends Component {
  getCloudAccounts() {
    const cloudMenu = _filter(_last(this.props.menuList).subMenu, item => item.title === 'Cloud Accounts');
    return cloudMenu && cloudMenu.length > 0 ? cloudMenu[0].subMenu : 0;
  }

  render() {
    if (!this.props.menuList) {
      return null;
    }
    return (
      <Row className={`nocontent ${this.props.marketplace.isVizWeb ? style.hide : ''}`}>
        <Layout className={style.headerLayout}>
          <div className={style.siteHeader}>
            <Header className={style.header}>
              <Col span={4} style={{ height: 'inherit' }}>
                <Link href={`${publicRuntimeConfig.asset}/hikes`}>
                  <a title="Kony Logo">
                    <img
                      src={`${publicRuntimeConfig.asset}/static/dist/images/productlogo.svg`}
                      className={style.logo}
                      alt="HCL Volt MX Tutorials"
                    />
                    <br />
                  </a>
                </Link>
              </Col>
              <Col
                xs={0}
                sm={0}
                md={20}
                lg={20}
                className={this.props.marketplace.isVizApp ? style.hide : null}
              >
                <DesktopMenu menuList={this.props.menuList} url={this.props.url} />
              </Col>
              <Col
                xs={18}
                sm={18}
                md={this.props.marketplace.isVizApp ? 18 : 0}
                lg={0}
                className={style.heading}
              >
                <Link href="/">
                  <h3>MARKETPLACE</h3>
                </Link>
              </Col>
              <Col xs={2} sm={2} md={0} lg={0} className={style.mobileMenu}>
                <MobileMenu
                  menus={this.props.menuList}
                  name={this.props.name}
                  cloudMenu={this.getCloudAccounts()}
                  className={this.props.marketplace.isVizApp ? 'hide' : null}
                  url={this.props.url}
                />
              </Col>
            </Header>
          </div>
        </Layout>
      </Row>
    );
  }
}

const mapStateToProps = ({ marketplace }) => ({ marketplace });

export default connect(mapStateToProps)(SiteHeader);
