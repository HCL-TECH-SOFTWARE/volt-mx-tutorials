import React, { Component, useEffect, useState } from 'react';
import HikeHeader from '../src/components/HikeHeader';
import ToursList from '../src/components/ToursList';
import styles from './style.scss';
import { getCookie } from '../src/utils/cookies';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import { getHikesCategories } from '../src/utils/populate'

const HikePage = () => {
  const [categories, setCategories] = useState([]);

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
                  title={item.categoryName}
                  desc={item.categoryDescription}
                  alias={item.categoryAlias || item.categoryName}
                  tours={item.categoryTours}
                />) : null
            ))}
        </div>
    </div>
  );
}

export default HikePage;
