import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from 'antd/lib/breadcrumb';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './style.scss';
import { BASE_PATH_URL, isDev } from '../../config';
import i18next from '../../../i18n';

const URL = !isDev ? `/${BASE_PATH_URL}` : '';

const propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  search: PropTypes.string.isRequired,
};

const defaultProps = {
  className: '',
};

const HikeBreadCrumb = ({ title, className, search }) => {
  const router = useRouter();
  const path = router.asPath.split(/\?/);
  let isMXGo = false;
  if (path && path.length > 1) {
    const searchParams = new URLSearchParams(path[1].toLowerCase());
    isMXGo = searchParams.get('ismxgo') === 'true';
  }

  return (
    <div className={`${styles.breadcrumbWrapper} ${className}`}>
      <Breadcrumb separator={<span className={styles.divider}>/</span>}>
        <Breadcrumb.Item>
          <Link
            href={{
              pathname: `${URL}/hikes`,
              query: {
                lang: i18next.language,
                ismxgo: isMXGo,
              },
            }}
          >
            <a className={styles.parent}>
              HIKES
            </a>
          </Link>
        </Breadcrumb.Item>
        {
          search !== undefined && search !== null
            ? (
              <Breadcrumb.Item>
                <Link
                  href={{
                    pathname: `/hikes/search/${search}}`,
                    query: {
                      lang: i18next.language,
                    },
                  }}
                >
                  <a className={styles.parent}>
                    {search}
                  </a>
                </Link>
              </Breadcrumb.Item>
            )
            : null
        }
        <Breadcrumb.Item className={styles.child}>
          {title || null}
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};

HikeBreadCrumb.propTypes = propTypes;
HikeBreadCrumb.defaultProps = defaultProps;

export default HikeBreadCrumb;
