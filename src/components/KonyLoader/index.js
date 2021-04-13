import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const KonyLoader =
  ({
    inline,
    size,
    height,
    width,
    className,
    style,
  }) => (
    <div style={style} className={`${styles.loaderWrapper} ${inline ? styles.inline : null} ${className}`}>
      <div className={styles.content}>
        <div className={styles.center}>
          <img
            src={`${publicRuntimeConfig.asset}/static/dist/images/loader.svg`}
            alt="Loader"
            height={height || size}
            width={width || size}
          />
        </div>
      </div>
    </div>
  );

KonyLoader.propTypes = {
  inline: PropTypes.bool,
  size: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  className: PropTypes.string,
};

KonyLoader.defaultProps = {
  inline: false,
};

export default KonyLoader;
