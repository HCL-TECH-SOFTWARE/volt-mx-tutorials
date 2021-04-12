import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';
import Icon from 'antd/lib/icon';
import KonyLoader from '../KonyLoader';
import style from './style.scss';

const handleClick = (e) => {
  e.preventDefault();
  const triggerElement = e.target;
  if (triggerElement.href && triggerElement.getAttribute('href')[0] === '#') {
    const scrollElementName = triggerElement.getAttribute('href').substr(1);
    const scrollElement = document.getElementsByName(scrollElementName)[0];
    document.getElementsByClassName(style.sanitizedDocContainer)[0].scroll({
      top: scrollElement.offsetTop - 60,
      behavior: 'smooth',
    });
  }
  const nextSiblingElement = triggerElement.parentNode.nextElementSibling;
  if (nextSiblingElement && nextSiblingElement.className === style.content) {
    nextSiblingElement.className += ` ${style.show}`;
  } else if (nextSiblingElement && nextSiblingElement.className === `${style.content} ${style.show}`) {
    nextSiblingElement.className = style.content;
  }
  const expanderIconElement = triggerElement.parentNode.children[0];
  if (expanderIconElement && expanderIconElement.className === 'plus square outline icon') {
    expanderIconElement.className = 'minus square outline icon';
  } else if (expanderIconElement && expanderIconElement.className === 'minus square outline icon') {
    expanderIconElement.className = 'plus square outline icon';
  }
};


const scrollToTop = (e) => {
  e.preventDefault();
  const docsTab = document.getElementsByClassName(style.sanitizedDocWrapper)[0];
  document.getElementsByClassName(style.sanitizedDocContainer)[0].scroll({
    top: docsTab.offsetTop - 130,
    behavior: 'smooth',
  });
};


class DocWithSanitizedHtml extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      loading: true,
    };
  }

  componentWillMount() {
    fetch(this.props.src)
      .then(res => res.text())
      .then(res => this.setState({
        data: res,
        loading: false,
      }));
  }

  componentDidMount() {
    document.getElementsByClassName(style.docFrame)[0].addEventListener('scroll', () => {
      const scrollpos = document.getElementsByClassName(style.sanitizedDocWrapper)[0].scrollTop;
      const docsTab = document.getElementsByClassName(style.sanitizedDocWrapper)[0];
      const scrollToTopButton = document.getElementsByClassName(style.scrollToTop)[0];

      if (docsTab && scrollToTopButton) {
        if (scrollpos > docsTab.offsetTop + 130) {
          scrollToTopButton.classList.add(style.show);
        } else {
          scrollToTopButton.classList.remove(style.show);
        }
      }
    });
  }

  render() {
    return (
      <div className={style.sanitizedDocContainer}>
        <div
          className={style.sanitizedDocWrapper}
          onClick={e => handleClick(e)}
          dangerouslySetInnerHTML={
            {
              __html: sanitizeHtml(this.state.data, {
                allowedAttributes: false,
                allowedTags: false,
                exclusiveFilter(frame) {
                  return frame.tag === 'title' ||
                    frame.tag === 'link' ||
                    frame.tag === 'meta';
                },
                transformTags: {
                  i(tagName, attribs) {
                    if (attribs && attribs.class) {
                      return {
                        tagName: 'i',
                        attribs: {
                          class: 'plus square outline icon',
                          'aria-hidden': true,
                        },
                      };
                    }
                    return {
                      tagName: 'i',
                    };
                  },
                  div(tagName, attribs) {
                    if (attribs) {
                      if (attribs.class === 'expander') {
                        return {
                          tagName: 'div',
                          attribs: {
                            class: style.expander,
                          },
                        };
                    } else if (attribs.class === 'note') {
                        return {
                          tagName: 'div',
                          attribs: {
                            class: style.note,
                          },
                        };
                      } else if (attribs.class === 'content') {
                        return {
                          tagName: 'div',
                          attribs: {
                            class: style.content,
                          },
                        };
                      }
                    return {
                      tagName: 'div',
                    };
                  }
                      return {
                        tagName: 'div',
                      };
                  },
                },
              }),
            }
          }
        />
        <button
          onClick={e => scrollToTop(e)}
          className={style.scrollToTop}
        >
          <Icon type="up" theme="outlined" />
        </button>
        <KonyLoader inline className={this.state.loading ? '' : style.hide} />
      </div>
    );
  }
}

DocWithSanitizedHtml.propTypes = {
  src: PropTypes.string,
};

DocWithSanitizedHtml.defaultProps = {
  src: '',
};

export default DocWithSanitizedHtml;
