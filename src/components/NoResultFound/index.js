import React from 'react';
import PostIdeaButton from '../PostIdea';
import style from './styles.scss';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const getLink = (isViz, href, title) => (
  isViz ? <li className={style.coolWhite}>{title}</li>
    : <li className={style.coolWhite}><a href={href}>{title}</a></li>
);

const NoResultFound = ({
  noResult, message, minHeight, hideButton, isViz,
}) => (
  <div className={`${style.noResults} ${minHeight ? style.minHeight : ''}`}>
    <img src={`${publicRuntimeConfig.asset}/static/dist/images/noresult.png`} width="424" height="354" alt="No Result Found" className={style.NoResultFoundImg} />
    {
      message ? (
        <h3>{message}</h3>
      ) : (
        <h2><b>{noResult ? 'Sorry, No Result Found :(' : "Can't find what you are looking for?"}</b></h2>
      )
    }
    {
      !hideButton ? (<PostIdeaButton />) : null
    }
    <div>
      <div>
        <p className={style.searchSuggestionText}><b>Search Suggestions:</b></p>
        <div>
          <ul className={style.horizontalList}>
            <table>
              <tr>
                <td className={style.paddingNone}>
                  <li className={style.listItem}>
                    <h4>Check you spelling.</h4>
                  </li>
                </td>
                <td className={style.paddingNone}>
                  <li className={style.listItem}>
                    <h4>Try more general words.</h4>
                  </li>
                </td>
                <td className={style.paddingNone}>
                  <li className={style.listItem}>
                    <h4>Try different words that mean the same thing.</h4>
                  </li>
                </td>
              </tr>
            </table>
          </ul>
        </div>
      </div>
    </div>
    <h1 className={style.helpSearch}><b>Or, may be we can help...</b></h1>
    <div className={style.divContainerMain}>
      <div className={style.divSubContainerLeft}>
        <br />
        <h2><b>Top Searches</b></h2>
        <br />
        <tr>
          <td>
            <ol className={style.roundedList}>
              {
                getLink(isViz, '/search/Sliding Menu', 'Sliding Menu')
              }
              {
                getLink(isViz, '/search/List and Details', 'List and Details')
              }
              {
                getLink(isViz, '/search/Login - Active Directory', 'Login - Active Directory')
              }
              {
                getLink(isViz, '/search/Advance Hamburger Menu', 'Advance Hamburger Menu')
              }
              {
                getLink(isViz, '/search/Login - Basic', 'Login - Basic')
              }
            </ol>
          </td>
          <td>
            <ol className={style.roundedList} start="6">
              {
                getLink(isViz, '/search/List Details (Employee)', 'List Details (Employee)')
              }
              {
                getLink(isViz, '/search/News and Weather', 'News and Weather')
              }
              {
                getLink(isViz, '/search/Place Locator', 'Place Locator')
              }
              {
                getLink(isViz, '/search/Date Range Picker', 'Date Range Picker')
              }
              {
                getLink(isViz, '/search/Employee Directory', 'Employee Directory')
              }
            </ol>
          </td>
        </tr>
      </div>
      <div className={style.divSubContainerRight}>
        <br />
        <h2><b>Popular Categories</b></h2>
        <br />
        <tr>
          <td>
            <ol className={style.roundedList}>
              {
                getLink(isViz, '/r?category=2626', 'App Group')
              }
              {
                getLink(isViz, '/r?category=2119', 'Applications')
              }
              {
                getLink(isViz, '/r?category=2633', 'Code Module')
              }
              {
                getLink(isViz, '/r?category=2120', 'Collection Library')
              }
              {
                getLink(isViz, '/r?category=2121', 'Components')
              }
            </ol>
          </td>
          <td>
            <ol className={style.roundedListR} start="6">
              {
                getLink(isViz, '/r?category=2123', 'Backend Services')
              }
              {
                getLink(isViz, '/r?category=2124', 'Data Adapter')
              }
              {
                getLink(isViz, '/r?category=2125', 'Data Models')
              }
            </ol>
          </td>
        </tr>
      </div>
    </div>
  </div>

);

export default NoResultFound;
