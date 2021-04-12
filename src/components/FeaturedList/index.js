import React, { Component } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Carousel from 'antd/lib/carousel';
import PropTypes from 'prop-types';
import style from './style.scss';
import FeaturedCard from '../FeaturedCard';

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  centerMode: true,
  centerPadding: '40px',
  className: style.carousel,
  dots: false,
};

export default class FeaturedList extends Component {
  render() {
    const { assets } = this.props;
    return (
      <Row className="featuredListWrapper">
        <Row gutter={16} className={style.domainTitleWrapper}>
          <h1 className={style.title}>Featured</h1>
        </Row>
        <Col lg={24} md={24} sm={0} xs={0}>
          <div className={style.featuredCardListWrapper}>
            {
              assets.map(asset => (
                <div key={asset.ID} className={style.assetCardContainer}>
                  <FeaturedCard asset={asset} />
                </div>))
            }
          </div>
        </Col>
        <Col lg={0} md={0} sm={24} xs={24}>
          <Carousel {...settings}>
            {
              assets.map(asset => (
                <div key={asset.ID} className={style.carouselCardContainer}>
                  <FeaturedCard asset={asset} />
                </div>))
            }
          </Carousel>
        </Col>
      </Row>
    );
  }
}

FeaturedList.propTypes = {
  assets: PropTypes.array,
};

FeaturedList.defaultProps = {
  assets: [],
};
