import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Breadcrumb from 'antd/lib/breadcrumb';
import style from './style.scss';
import { getUrl } from '../../utils/initialize';

const BreadcrumbItem = ({ name, path }) => (
  <Breadcrumb.Item separator={<span className={style.divider}>/</span>}>
    <Link href={getUrl(path)}>
      <a className={style.parent}>{name}</a>
    </Link>
  </Breadcrumb.Item>
);

const KonyBreadcrumb = ({ title, subRoutes }) => (
  <div className={style.breadcrumbWrapper}>
    <Breadcrumb separator={<span className={style.divider}>/</span>}>
      <Breadcrumb.Item key="marketplace">
        <Link href={getUrl('/')}>
          <a className={style.parent}>
            Marketplace
          </a>
        </Link>
      </Breadcrumb.Item>
      { subRoutes && subRoutes.length > 0 ? subRoutes.map(
        ({ path, name }) => (<BreadcrumbItem key={name} path={path} name={name} />),
      ) : null }
      <Breadcrumb.Item><h1 className={style.child}>{title}</h1></Breadcrumb.Item>
    </Breadcrumb>
  </div>
);

KonyBreadcrumb.propTypes = {
  title: PropTypes.string,
  rootRedirect: PropTypes.func,
};

KonyBreadcrumb.defaultProps = {
  title: '',
  rootRedirect: null,
};

export default KonyBreadcrumb;
