import React from "react";
import Breadcrumb from "antd/lib/breadcrumb";
import Link from "next/link";
import styles from "./style.scss";
import { BASE_PATH_URL, isDev } from "../../config";
import i18next from 'i18next';

const URL = !isDev ? `/${BASE_PATH_URL}` : "";

export default ({ title, className, search }) => (
  <div className={`${styles.breadcrumbWrapper} ${className}`}>
    <Breadcrumb separator={<span className={styles.divider}>/</span>}>
      <Breadcrumb.Item>
      <Link 
          href={{pathname: `${URL}/hikes`,
          query: {
            lang: i18next.language,
          }
          }}
        >
         <a className={styles.parent}>HIKES</a>
        </Link>
      </Breadcrumb.Item>
      {search !== undefined && search !== null ? (
        <Breadcrumb.Item>
      	<Link
                href={{ pathname: `/hikes/search/${search}}`,
                query: {
                  lang: i18next.language,
                }
                }}>
            <a className={styles.parent}>{search}</a>
          </Link>
        </Breadcrumb.Item>
      ) : null}
      <Breadcrumb.Item className={styles.child}>
        {title || null}
      </Breadcrumb.Item>
    </Breadcrumb>
  </div>
);
