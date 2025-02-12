import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import InfiniteScroll from 'react-infinite-scroller';
import Skeleton from 'antd/lib/skeleton';
import _flatten from 'lodash/flatten';
import _get from 'lodash/get';
import HikeHeader from '../src/components/HikeHeader';
import TourCard from '../src/components/TourCard';
import HikeBreadCrumb from '../src/components/HikeBreadCrumb';
import styles from './style.scss';
import { getMapCategories } from '../src/utils/populate';
import i18next from '../i18n';

const LoadingSkeleton = () => (
  <Row type="flex" gutter={32} className={styles.skeletonWrapper}>
    {[1, 2, 3].map(x => (
      <Col key={x} className={styles.skeletonCard} span={8}>
        <Skeleton active title paragraph={{ rows: 2 }} />
      </Col>
    ))}
  </Row>
);

const propTypes = {
  url: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const HikePage = ({ url }) => {
  const [tours, setTours] = useState([]);
  const [hasMore] = useState(false);

  const keyword = _get(url, 'query.keyword', '');

  const getHikeTours = async () => {
    if (!keyword) {
      return;
    }

    const hikes = await getMapCategories();

    // map all tours
    const mapTours = hikes.map(hike => hike.categoryTours);

    // find matches via keyword
    const results = _flatten(mapTours).filter((tour) => {
      const { description, title, details } = tour;

      return (
        description.toLowerCase().includes(keyword.toLowerCase())
        || title.toLowerCase().includes(keyword.toLowerCase())
        || details.toLowerCase().includes(keyword.toLowerCase())
      );
    });

    setTours(results);
  };

  useEffect(() => {
    getHikeTours();
    return () => {};
  }, [keyword]);

  return (
    <div className={styles.hikeBody}>
      <HikeHeader keyword={keyword} />
      <div className={styles.hikeContainer}>
        <HikeBreadCrumb title={keyword} search={null} />
        <InfiniteScroll
          pageStart={0}
          initialLoad
          loadMore={getHikeTours}
          hasMore={hasMore}
          loader={<LoadingSkeleton key={0} />}
        >
          <Row
            type="flex"
            className={`${styles.assetsContainer} hikesCategoryPage`}
          >
            {tours.length > 0
              ? tours.map(item => (
                <TourCard tour={item} key={item.nid} search={keyword} />
              ))
              : null}
            {tours.length === 0 && !hasMore ? (
              <h2 className={styles.noresult}>
                {i18next.t('search_no_results')}
              </h2>
            ) : null}
          </Row>
        </InfiniteScroll>
      </div>
    </div>
  );
};

HikePage.propTypes = propTypes;

export default HikePage;
