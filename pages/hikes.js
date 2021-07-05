import React, { useEffect, useState } from 'react';
import i18next from 'i18next';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import HikeHeader from '../src/components/HikeHeader';
import ToursList from '../src/components/ToursList';
import styles from './style.scss';
import getHikesCategories from '../src/utils/populate';

const HikePage = () => {
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();

  const getHikes = async () => {
    const { hikesData } = publicRuntimeConfig;
    const hikes = await getHikesCategories(hikesData);
    setCategories(hikes);
  };

  useEffect(() => {
    getHikes();
    return () => {
    };
  }, []);

  useEffect(() => {
    const path = router.asPath.split(/\?/);
    const searchParams = new URLSearchParams(path[1]);
    const lang = searchParams.get('lang');

    if (lang) {
      if (lang !== i18next.language) {
        router.push(router.asPath);
      }
    } else {
      router.push({
        pathname: path[0] || router.pathname,
        query: {
          lang: 'en-US',
        },
      });
    }
  }, [i18next.language, router.query]);

  return (
    <div className={styles.hikeBody}>
      <HikeHeader />
      <div className={styles.hikeContainer}>
        {categories
          .map(item => (
            item.categoryTours !== null ? (
              <ToursList
                key={item.categoryName}
                title={item.categoryName}
                desc={item.categoryDescription}
                alias={item.categoryAlias || item.categoryName}
                tours={item.categoryTours}
              />) : null
          ))}
      </div>
    </div>
  );
};

export default HikePage;
