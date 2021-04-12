import React from 'react';
import PropTypes from 'prop-types';
import style from './style.scss';
import KonyButton from '../KonyButton';

const CodeExplorer = ({ link }) => (
  <div className={style.exportButtonWrapper}>
    <KonyButton
      title="Explore Code"
      type="normal"
      color="red"
      className={style.exportButton}
      isCode
      href={link}
      target="_blank"
    />
  </div>
);

CodeExplorer.propTypes = {
  link: PropTypes.string,
};

CodeExplorer.defaultProps = {
  link: '',
};

export default CodeExplorer;
