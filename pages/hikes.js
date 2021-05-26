import React, { Component, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HikeHeader from '../src/components/HikeHeader';
import ToursList from '../src/components/ToursList';
import styles from './style.scss';
import { getCookie } from '../src/utils/cookies';
import getConfig from 'next/config';
import nextI18NextConfig from '../next-i18next.config';
const { publicRuntimeConfig } = getConfig();
import { getHikesCategories } from '../src/utils/populate'

const HikePage = () =>   {

    const [categories, setCategories] = useState([]);
    const { t } = useTranslation(); 

    const getHikes = async () => {
      const { hikesData }  = publicRuntimeConfig;
      const hikes = await getHikesCategories(hikesData);

      setCategories(hikes)

    }

    useEffect(() => {
      getHikes();
      return () => {
      }
    }, [])

    return (
      <div className={styles.hikeBody}>
        <HikeHeader />
        <div className={styles.hikeContainer}>
          {categories
            .map(item => (
              item.categoryTours !== null ? (
                <ToursList
                  key={item.categoryName}
                  title={t(item.categoryName)}
                  desc={t(item.categoryDescription)}
                  alias={item.categoryAlias || t(item.categoryName)}
                  tours={item.categoryTours}
                />) : null
            ))}
        </div>
      </div>
    );
  }

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale || nextI18NextConfig.i18n.defaultLocale, ['common'], nextI18NextConfig),
  },
});

export default HikePage;
