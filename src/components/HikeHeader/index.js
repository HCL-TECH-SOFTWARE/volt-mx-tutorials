import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Layout from 'antd/lib/layout';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import { Dropdown, Icon, Menu } from 'antd';
import Link from 'next/link';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import style from './style.scss';
import HikeSearch from '../HikeSearch';
import i18next, { locales } from '../../../i18n';

const { Header } = Layout;

const HikeHeader = ({ search, keyword }) => {
  const { publicRuntimeConfig } = getConfig();
  const router = useRouter();
  const [language, setLanguage] = useState(i18next.language);

  useEffect(() => {
    setLanguage(i18next.language);
  }, [i18next.language]);

  const changeLang = useCallback((selectedLanguage) => {
    const refreshPath = router.asPath.includes('lang=') ? router.asPath.split(/=/)[0].concat(`=${selectedLanguage}`)
      : router.asPath.split(/=/)[0].concat(`?lang=${selectedLanguage}`);
    i18next.changeLanguage(selectedLanguage);
    router.push(refreshPath);
  }, []);

  const menu = (
    <Menu>
      {locales.map(locale => (
        <Menu.Item onClick={() => changeLang(locale)} key={locale}>
          {i18next.t(locale)}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Row className={style.headerRow}>
      <Layout className={style.headerLayout}>
        <Header className={style.header}>
          <Row type="flex" justify="space-between">
            <Col span={4} style={{ height: 'inherit' }}>
              <Link
                href={{
                  pathname: `${publicRuntimeConfig.asset}/hikes`,
                  query: {
                    lang: i18next.language,
                  },
                }}
              >
                <a title="Kony Logo" className={style.logo}>
                  <img
                    src={`${
                      publicRuntimeConfig.asset
                    }/static/dist/images/productlogo.svg`}
                    className={style.logo}
                    alt="logo"
                  />
                  <br />
                </a>
              </Link>
            </Col>
            <Col className={style.camp}>
              <img
                src={`${
                  publicRuntimeConfig.asset
                }/static/dist/images/camp-mountain.svg`}
                alt="camp mountain"
              />
            </Col>
          </Row>
        </Header>
        <div className={style.subHeader}>
          {search ? (
            <div className={style.search}>
              <HikeSearch keyword={keyword} />
            </div>
          ) : null}
          <div className={style.switchLang}>
            <Dropdown overlay={menu} trigger={['click']}>
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                <Icon type="global" />
                {i18next.t(language)}
                <Icon type="caret-down" />
              </a>
            </Dropdown>
          </div>
        </div>
      </Layout>
    </Row>
  );
};

HikeHeader.propTypes = {
  search: PropTypes.bool,
  keyword: PropTypes.string,
};

HikeHeader.defaultProps = {
  search: true,
  keyword: '',
};

export default HikeHeader;
