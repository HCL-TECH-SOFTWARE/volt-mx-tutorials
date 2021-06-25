import React, { Component, useEffect, useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import InfiniteScroll from "react-infinite-scroller";
import Skeleton from "antd/lib/skeleton";
import _uniqWith from "lodash/uniqWith";
import _isEqual from "lodash/isEqual";
import HikeHeader from "../src/components/HikeHeader";
import TourCard from "../src/components/TourCard";
import HikeBreadCrumb from "../src/components/HikeBreadCrumb";
import styles from "./style.scss";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { getHikesCategories } from "../src/utils/populate";
import queryString from "querystring";
import { BASE_PATH_URL, isDev } from "../src/config";

const LoadingSkeleton = () => (
  <Row type="flex" gutter={32} className={styles.skeletonWrapper}>
    {[1, 2, 3].map((x) => (
      <Col key={x} className={styles.skeletonCard} span={8}>
        <Skeleton active title paragraph={{ rows: 2 }} />
      </Col>
    ))}
  </Row>
);

const HikePage = ({ url }) => {
  const [tours, setTours] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  const parsed = queryString.parse(url.asPath);
  const parseUrl = !isDev ? `/${BASE_PATH_URL}` : "";
  const keyword = parsed[`${parseUrl}/hikes/search?keyword`];

  const getHikeTours = async () => {
    const { hikesData } = publicRuntimeConfig;
    const hikes = await getHikesCategories(hikesData);

    // map all tours
    const mapTours = hikes.map((hike) => hike.categoryTours);

    // flatten tour details
    const tours = mapTours.reduce((a, b) => a.concat(b), []);

    // find matches via keyword
    const results = tours.filter((tour) => {
      const { description, title, details } = tour;

      return (
        description.toLowerCase().includes(keyword.toLowerCase()) ||
        title.toLowerCase().includes(keyword.toLowerCase()) ||
        details.toLowerCase().includes(keyword.toLowerCase())
      );
    });

    setTours(results);
  };

  useEffect(() => {
    getHikeTours();
    return () => {};
  }, []);

  return (
    <div className={styles.hikeBody}>
      <HikeHeader keyword={keyword} />
      <div className={styles.hikeContainer}>
        <HikeBreadCrumb title={keyword} />
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
              ? tours.map((item) => (
                  <TourCard tour={item} key={item.nid} search={keyword} />
                ))
              : null}
            {tours.length === 0 && !hasMore ? (
              <h2 className={styles.noresult}>
                No matching records found. Please modify search criteria.
              </h2>
            ) : null}
          </Row>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default HikePage;
