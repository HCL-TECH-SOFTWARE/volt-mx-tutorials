import React from 'react';
import Col from 'antd/lib/col';
import Link from 'next/link';
import PropTypes from 'prop-types';
import style from './style.scss';
import { truncateAdvance } from '../../utils';
import { BASE_PATH_URL } from '../../config';
import i18next from '../../../i18n';

const isProdUrl = process.env.NODE_ENV === 'production' ? `${BASE_PATH_URL}/` : '';

const TourCard = ({
  tour, dbx, search, isComposer, isMXGo,
}) => (
  <Col sm={isComposer ? 8 : 6} xs={24}>
    <div className={style.tour}>
      {search !== undefined && search !== null ? (
        <Link
          href={{
            pathname: `${isProdUrl}${tour.alias}`,
            query: {
              lang: i18next.language,
              ismxgo: isMXGo,
            },
          }}
        >
          <div className={style.info}>
            <h2 className={`${style.title} ${dbx ? style.dbxColor : ""} `}>
              {truncateAdvance(tour.title, 50)}
            </h2>
            <p className={style.desc}>{tour.description}</p>
            <p className={style.meta}>{`${i18next.t('step', { count: tour.cards })} / ${tour.time}`}</p>
          </div>
        </Link>
      ) : (
        <Link
          href={{
            pathname: `${isProdUrl}${tour.alias}`,
            query: {
              lang: i18next.language,
            },
          }}
        >
          <div className={style.info}>
            <h2 className={`${style.title} ${dbx ? style.dbxColor : ""} `}>
              {truncateAdvance(tour.title, 50)}
            </h2>
            <p className={style.desc}>{tour.description}</p>
            <p className={style.meta}>{`${i18next.t('step', { count: tour.cards })} / ${tour.time}`}</p>
          </div>
        </Link>
      )}
    </div>
  </Col>
);

TourCard.propTypes = {
  tour: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  dbx: PropTypes.bool,
  search: PropTypes.string,
  isComposer: PropTypes.bool,
};

TourCard.defaultProps = {
  tour: {},
  dbx: false,
  search: '',
  isComposer: false,
};

export default TourCard;
