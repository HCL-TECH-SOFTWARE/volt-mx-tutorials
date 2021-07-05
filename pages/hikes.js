import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import i18next from 'i18next';
import HikeHeader from '../src/components/HikeHeader';
import ToursList from '../src/components/ToursList';
import styles from './style.scss';
import { getMapCategories } from '../src/utils/populate';

const HikePage = () => {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const getHikes = async () => {
    const categoriesMaps = await getMapCategories();
    setCategories(categoriesMaps);
  };

  useEffect(() => {
    getHikes();
    return () => {};
  }, []);

  useEffect(() => {
    const { lang } = router.query;
    if (lang) {
      if (lang !== i18next.language) {
        router.reload(router.asPath);
      }
    } else {
      router.push({
        pathname: router.pathname,
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
        {categories.map(item => (item.categoryTours !== null ? (
          <ToursList
            key={item.categoryName}
            title={item.categoryName}
            desc={item.categoryDescription}
            alias={item.categoryAlias || item.categoryName}
            tours={item.categoryTours}
          />
        ) : null))}
      </div>
    </div>
  );
};

export default HikePage;
