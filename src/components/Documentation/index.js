import React from 'react';
import PropTypes from 'prop-types';
import style from './style.scss';
import DocInIFrame from './DocInIFrame';
import DocWithSanitizedHtml from './DocWithSanitizedHtml';

const getSecuredDocLink = src => src.replace('http:', 'https:');

const Documentation = (props) => {
  const getDocContainer = () => {
    if (props.isInIframe) {
      return <DocInIFrame src={getSecuredDocLink(props.src)} />;
    }
    return <DocWithSanitizedHtml src={getSecuredDocLink(props.src)} />;
  };

  return (
    <div className={style.docFrame}>
      {getDocContainer()}
    </div>
  );
};

Documentation.propTypes = {
  isInIframe: PropTypes.bool,
  src: PropTypes.string,
};

Documentation.defaultProps = {
  isInIframe: false,
  src: '',
};

export default Documentation;
