import React from 'react';
import PropTypes from 'prop-types';
import style from './style.scss';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const KonyGravatar = ({src}) => (
  <div className={style.gravatarWrapper}>
    <img
      src={src !== '' ? src : `${publicRuntimeConfig.asset}/static/dist/images/noGravatar.png`}
      className={style.gravatar}
      alt="User"
    />
  </div>
);

KonyGravatar.propTypes = {
  src: PropTypes.string,
};

KonyGravatar.defaultProps = {
  src: '',
};

export default KonyGravatar;
