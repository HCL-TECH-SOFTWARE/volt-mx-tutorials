import React from 'react';
import Row from 'antd/lib/row';
import PropTypes from 'prop-types';
import getConfig from 'next/config';
import TourCard from '../TourCard';
import style from './style.scss';
import i18next from '../../../i18n';

const { publicRuntimeConfig } = getConfig();

const ToursList = ({
  title, desc, tours,
}) => (
  <div>
    <Row className={style.domainTitleWrapper}>
      <div>
        {title.toLowerCase() === 'dbx' ? (
          <img src={`${publicRuntimeConfig.asset}/static/dist/images/dbx_logo.png`} className={style.title} />
        ) : (
          <h1 className={style.title}>
            {i18next.t(title).toUpperCase()}
          </h1>
        )}
        <div className={style.desc} dangerouslySetInnerHTML={{ __html: i18next.t(desc) }} />
      </div>
    </Row>
    <Row type="flex" className={style.assetsContainer}>
      {tours.map(item => (
        <TourCard tour={item} key={item.nid} dbx={title.toLowerCase() === 'dbx'} />
      ))}
    </Row>
  </div>
);

ToursList.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  tours: PropTypes.arrayOf(PropTypes.object).isRequired,
};

ToursList.defaultProps = {
  title: '',
  desc: '',
};

export default ToursList;
