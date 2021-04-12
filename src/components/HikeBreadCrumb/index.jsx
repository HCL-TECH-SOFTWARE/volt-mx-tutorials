import React from 'react';
import Breadcrumb from 'antd/lib/breadcrumb';
import Link from 'next/link';
import styles from './style.scss';

export default ({ title, className, search }) => (
  <div className={`${styles.breadcrumbWrapper} ${className}`}>
    <Breadcrumb separator={<span className={styles.divider}>/</span>}>
      <Breadcrumb.Item>
        <Link href="/hikes">
          <a className={styles.parent} >
            HIKES
          </a>
        </Link>
      </Breadcrumb.Item>
      {
        search !== undefined && search !== null
          ? (
            <Breadcrumb.Item>
              <Link href={`/hikes/search/${search}`}>
                <a className={styles.parent} >
                  {search}
                </a>
              </Link>
            </Breadcrumb.Item>
          )
          : null
      }
      <Breadcrumb.Item className={styles.child}>{title || null}</Breadcrumb.Item>
    </Breadcrumb>
  </div>
);
