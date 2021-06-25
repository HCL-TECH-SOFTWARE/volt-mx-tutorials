import React from 'react';
import PostIdeaButton from '../PostIdea';
import style from './style.scss';

const ProposeComponentWrapper = ({ noResult, message, minHeight, hideButton }) => (
  <div className={`${style.noResults} ${minHeight ? style.minHeight : ''}`}>
    {
      message ? (
        <h3>{message}</h3>
      ) : (
        <h3>{noResult ? 'No Result found' : "Can't find what you are looking for?"}</h3>
      )
    }
    {
      !hideButton ? (
      <PostIdeaButton />
      ) : null
    }
  </div>
);

export default ProposeComponentWrapper;
