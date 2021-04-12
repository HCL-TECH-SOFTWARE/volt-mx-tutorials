import React, { Component } from 'react';
import Row from 'antd/lib/row';
import Link from 'next/link';
import PropTypes from 'prop-types';
import TourCard from '../TourCard';
import style from './style.scss';

const ToursList = ({
  alias, title, desc, tours,
}) => (
  <div>
    <Row className={style.domainTitleWrapper}>
      <div>
        {title.toLowerCase() === 'dbx' ? (
          <img src="/volt-mx-tutorials/static/dist/images/dbx_logo.png" className={style.title} />
        ) : (
          <h1 className={style.title}>
            {title.toUpperCase()}
          </h1>
        )}
        <div className={style.desc} dangerouslySetInnerHTML={{ __html: desc }} />
      </div>
    </Row>
    <Row type="flex" className={style.assetsContainer}>
      {tours.map(item => (
        <TourCard tour={item} key={item.nid} dbx={title.toLowerCase() === 'dbx'} />
      ))}
    </Row>
  </div>
);
TourCard.propTypes = {
  title: PropTypes.string,
  tours: PropTypes.array,
};

TourCard.defaultProps = {
  title: '',
  tours: [],
};

export default ToursList;
