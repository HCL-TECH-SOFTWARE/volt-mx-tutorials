import React, { Component } from 'react';
import { instance as axios } from '../src/utils/initialize';
import HikeHeader from '../src/components/HikeHeader';
import ToursList from '../src/components/ToursList';
import styles from './style.scss';
import { getCookie } from '../src/utils/cookies';

class HikePage extends Component {
  static async getInitialProps({
    query, req, res, isServer,
  }) {
    const dbxQuery = query.is_dbx && query.is_dbx === 'true';
    let dbx = false;
    let hikeVizVersion = query.viz_version ? query.viz_version : false;
    if (isServer && dbxQuery) {
      res.cookie('is_dbx', true);
    }
    if (isServer && hikeVizVersion) {
      res.cookie('hike_viz_version', query.viz_version);
    }

    if (isServer && req?.cookies) {
      dbx = dbxQuery || req?.cookies.is_dbx;
      hikeVizVersion = hikeVizVersion || req?.cookies.hike_viz_version;
    } else {
      dbx = dbxQuery || getCookie('is_dbx');
      hikeVizVersion = hikeVizVersion || getCookie('hike_viz_version');
    }

    try {
      let requestURL = '/api/v1_1/hike/tours/configurations';
      if (hikeVizVersion) {
        requestURL = `${requestURL}?viz_version=${hikeVizVersion}`;
      }
      const responseData = await axios.get(requestURL);
      let { categories } = responseData.data;
      categories = categories.filter(tour => (dbx || tour.categoryName.toLowerCase() !== 'dbx'));

      return { noResult: categories.length === 0, categories, dbx };
    } catch (error) {
      return { error: true, noResult: true };
    }
  }

  render() {
    const { noResult } = this.props;
    if (noResult) {
      return (
        <div className={styles.hikeBody}>
          <HikeHeader />
          <div className={styles.hikeContainer}>
            <h2 className={styles.noresult}>
          No tours found for your Visualizer version.
            </h2>
          </div>
        </div>
      );
    }
    const { categories } = this.props;
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
}

export default HikePage;
