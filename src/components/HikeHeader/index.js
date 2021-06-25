import React from "react";
import PropTypes from "prop-types";
import Layout from "antd/lib/layout";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Link from "next/link";
import style from "./style.scss";
import HikeSearch from "../HikeSearch";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const { Header } = Layout;

const HikeHeader = ({ search, keyword }) => (
  <Row className={style.headerRow}>
    <Layout className={style.headerLayout}>
      <Header className={style.header}>
        <Row type="flex" justify="space-between">
          <Col span={4} style={{ height: "inherit" }}>
            <Link href={`${publicRuntimeConfig.asset}/hikes`}>
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
  keyword: "",
};

export default HikeHeader;
