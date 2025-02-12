import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import HikeHeader from '../src/components/HikeHeader';
import ToursList from '../src/components/ToursList';
import styles from './style.scss';
import { getMapCategories } from '../src/utils/populate';
import i18next from '../i18n';
import { enableLocales } from '../src/config/settings';

const HikePage = () => {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const getHikes = async () => {
    const categoriesMaps = await getMapCategories();
    setCategories(categoriesMaps);
  };

  const isMXGo = () => {
    const path = router.asPath.split(/\?/);
    const searchParams = new URLSearchParams(path[1].toLowerCase());
    return searchParams.get('ismxgo') === 'true';
  };

  useEffect(() => {
    getHikes();
    return () => {};
  }, [i18next.language, router.asPath]);

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
  }, []);

  return (
    <div className={styles.hikeBody}>
      <HikeHeader enableLocales={enableLocales} />
      <div className={styles.hikeContainer}>
        {categories.map(item => (item.categoryTours !== null ? (
          <ToursList
            key={item.categoryName}
            title={item.categoryName}
            desc={item.categoryDescription}
            alias={item.categoryAlias || item.categoryName}
            tours={item.categoryTours}
            isMXGo={isMXGo()}
          />
        ) : null))}
      </div>
    </div>
  );
};

export default HikePage;
