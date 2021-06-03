import React from 'react';
import PropTypes from 'prop-types';
import Layout from 'antd/lib/layout';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import {Menu, Dropdown, Button} from "antd";
import Link from 'next/link';
import style from './style.scss';
import HikeSearch from '../HikeSearch';
import getConfig from 'next/config';
import { setCookie } from '../../utils/cookies';
const { publicRuntimeConfig } = getConfig();
import Router from 'next/router'


const { Header } = Layout;

function handleMenuClick(e) {
  console.log(e);
  setCookie("langid",e.key);
  Router.reload(window.location.pathname);
}

const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="en-US" >
      Engish
    </Menu.Item>
    <Menu.Item key="zh-CN" >
      Chinese
    </Menu.Item>
    <Menu.Item key="gu-IN" >
      Indian
    </Menu.Item>
  </Menu>
);


const HikeHeader = ({ search, keyword }) => (
  <Row className={style.headerRow}>
    <Layout className={style.headerLayout}>
      <Header className={style.header}>
        <Row type="flex" justify="space-between">
          <Col span={4} style={{ height: 'inherit' }}>
            <Link href={`${publicRuntimeConfig.asset}/hikes`}>
              <a title="Kony Logo" className={style.logo}>
                <img src={`${publicRuntimeConfig.asset}/static/dist/images/productlogo.svg`} className={style.logo} alt="logo" />
                <br />
              </a>
            </Link>
          </Col>
          <Col  className={style.camp} >
            <img
              src={`${publicRuntimeConfig.asset}/static/dist/images/camp-mountain.svg`}             
              alt="camp mountain"
            />
          </Col>
           <Dropdown overlay={menu}> 
      <Button>
        Language 
      </Button>
    </Dropdown>
        </Row>
      </Header>
      {search ? (
        <div className={style.search}>
          <HikeSearch keyword={keyword} />
        </div>
      ) : null}


    </Layout>
  </Row>
);

HikeHeader.propTypes = {
  search: PropTypes.bool,
  keyword: PropTypes.string,
};

HikeHeader.defaultProps = {
  search: true,
  keyword: '',
};

export default HikeHeader;
