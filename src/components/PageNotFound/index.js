import React from 'react';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import KonyButton from '../../components/KonyButton';
import style from './style.scss';
import { getUrl } from '../../utils/initialize'
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const pageNotFound = () => (
  <React.Fragment>
    <Row className={style.pageOuter}>
      <Row className={style.pageWrapper}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <img
            src={`${publicRuntimeConfig.asset}/static/dist/images/error.svg`}
            alt="Page not found"
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} className={style.sidebarWrapper}>
          <h1>404</h1>
          <h2>Are you lost?</h2>
          <h3>Looks like you’ve wandered off trail. Try using the search bar above to find what you are looking for.</h3>
          <KonyButton
            title="Home"
            type="action"
            color="blue"
            href={getUrl("/")}
            className={style.button}
          />
        </Col>
      </Row>
    </Row>
  </React.Fragment>
);

export default pageNotFound;
