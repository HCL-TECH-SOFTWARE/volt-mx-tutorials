import React from 'react';
import PropTypes from 'prop-types';
import style from './style.scss';

const DidYouMean = ({ keyword, suggestion }) => (
  <div className={style.DidYouMean}>
    <hr className={style.horizontalLine} />
    <p className={style.didYouMeanHeader}>
      Did you mean :
      <a href={`/search/${suggestion}`}><u>{suggestion}</u></a>
    </p>
    <p className={style.showingResultsFor}>{`Showing results for ${keyword}`}</p>
    <hr className={style.horizontalLine} />
  </div>
);

DidYouMean.propTypes = {
  keyword: PropTypes.string.isRequired,
  suggestion: PropTypes.string.isRequired,
};

export default DidYouMean;
