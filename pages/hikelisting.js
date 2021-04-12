import React, { Component } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import InfiniteScroll from 'react-infinite-scroller';
import Skeleton from 'antd/lib/skeleton';
import _uniqWith from 'lodash/uniqWith';
import _isEqual from 'lodash/isEqual';
import { instance as axios } from '../src/utils/initialize';
import HikeHeader from '../src/components/HikeHeader';
import TourCard from '../src/components/TourCard';
import HikeBreadCrumb from '../src/components/HikeBreadCrumb';
import styles from './style.scss';
import { capitalizeFirstLetter } from '../src/utils';
import { getCookie } from '../src/utils/cookies';

const LoadingSkeleton = () => (
  <Row type="flex" gutter={32} className={styles.skeletonWrapper}>
    {[1, 2, 3].map(x => (
      <Col key={x} className={styles.skeletonCard} span={8} >
        <Skeleton active title paragraph={{ rows: 2 }} />
      </Col>
    ))}
  </Row>
);

class HikePage extends Component {
  state = {
    error: false,
    tours: [],
    hasMore: true,
    toursCount: 0,
    category: capitalizeFirstLetter(this.props.url.query.category),
    keyword: this.props.url.query.keyword,
  };

  getHikeTours = () => {
    const { keyword, category } = this.state;
    let LocalHeaders = {
      'X-KONY-TOUR-SORTBY': 'Newest',
    };
    if (keyword) {
      LocalHeaders = {
        'X-KONY-TOUR-KEYWORD': keyword,
      };
    } else if (category) {
      LocalHeaders = {
        'X-KONY-TOUR-CATEGORY': category,
      };
    }

    if (getCookie('hike_viz_version') && '' !== getCookie('hike_viz_version')) {
      LocalHeaders = {
        'X-KONY-TOUR-PLATFORM-VERSION': getCookie('hike_viz_version'),
      };
    }

    axios
      .get(`/api/v1_1/hike/tours/list`, {
        params: {
          count: 18,
          offset: this.state.toursCount,
        },
        headers: LocalHeaders,
      })
      .then((res) => {
        if (res.data) {
          this.setState({
            hasMore: res.data.Details.length === 18,
            tours: _uniqWith([...this.state.tours, ...res.data.Details], _isEqual),
            toursCount: this.state.toursCount + res.data.Details.length,
          });
        }
      })
      .catch((err) => {
        this.setState({
          error: false,
          hasMore: false,
        });
      });
  };

  render() {
    const {
      tours, hasMore, category, keyword,
    } = this.state;
    return (
      <div className={styles.hikeBody}>
        <HikeHeader keyword={keyword} />
        <div className={styles.hikeContainer}>
          <HikeBreadCrumb title={keyword || category} />
          <InfiniteScroll
            pageStart={0}
            initialLoad
            loadMore={this.getHikeTours}
            hasMore={hasMore}
            loader={<LoadingSkeleton key={0} />}
          >
            <Row type="flex" className={`${styles.assetsContainer} hikesCategoryPage`}>
              {
                tours.length > 0
                  ? tours.map(item => (
                    <TourCard
                      tour={item}
                      key={item.nid}
                      search={keyword}
                    />))
                  : null
              }
              {tours.length === 0 && !hasMore ? (
                <h2 className={styles.noresult}>
                  {keyword
                    ? 'No matching records found. Please modify search criteria.'
                    : `No records found in ${capitalizeFirstLetter(category)} category.`}
                </h2>
              ) : null}
            </Row>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default HikePage;
