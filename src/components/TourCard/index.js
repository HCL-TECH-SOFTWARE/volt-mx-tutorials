import React, { Component } from 'react';
import Col from 'antd/lib/col';
import Link from 'next/link';
import PropTypes from 'prop-types';
import style from './style.scss';
import {truncateAdvance} from '../../utils';

const TourCard = ({ tour, dbx, search }) => (
  <Col sm={6} xs={24}>
    <div className={style.tour}>
      {
        search !== undefined && search !== null
          ? (
          <Link
            href={
              {
                pathname: `/${tour.alias}`,
                query: {
                  search: search
                }
              }
            }
          >
            <div className={style.info}>
              <h2 className={`${style.title} ${dbx ? style.dbxColor : ''} `}>{truncateAdvance(tour.title, 34)}</h2>
              <p className={style.desc}>{tour.description}</p>
              <p className={style.meta}>{`${tour.cards} Steps / ${tour.time}`}</p>
            </div>
          </Link>
        )
          : (
            <Link href={`/${tour.alias}`}>
              <div className={style.info}>
                <h2 className={`${style.title} ${dbx ? style.dbxColor : ''} `}>{truncateAdvance(tour.title, 34)}</h2>
                <p className={style.desc}>{tour.description}</p>
                <p className={style.meta}>{`${tour.cards} Steps / ${tour.time}`}</p>
              </div>
            </Link>
          )
      }
    </div>
  </Col>
);

TourCard.propTypes = {
  tour: PropTypes.object,
  dbx: PropTypes.bool,
};

TourCard.defaultProps = {
  tour: {},
  dbx: false,
};

export default TourCard;
