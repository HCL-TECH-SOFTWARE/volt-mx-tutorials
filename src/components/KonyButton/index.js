import React from 'react';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import PropTypes from 'prop-types';
import style from './style.scss';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const checkSelected = (selected) => {
  if (selected) {
    return (
      <img
        src={`${publicRuntimeConfig.asset}/static/dist/images/icons/filterCross.svg`}
        alt="icon"
        className={style.filterCloseIcon}
      />
    );
  }
};

const renderDownloadIcon = (type) => {
  if (type === 'download') {
    return (
      <img
        src={`${publicRuntimeConfig.asset}/static/dist/images/download.svg`}
        alt="Download icon"
        className={style.downloadIcon}
      />
    );
  }
  return null;
};

const renderCodeIcon = (isCode) => {
  if (isCode) {
    return (
      <img
        src={`${publicRuntimeConfig.asset}/static/dist/images/icons/codeIcon.png`}
        alt="Code icon"
        className={style.codeIcon}
      />
    );
  }
  return null;
};

const KonyButton = ({
  title,
  type,
  color,
  active,
  selected,
  children,
  className,
  onClick,
  featured,
  href,
  target,
  disabled,
  isCode,
}) => (
  <Button
    title={title}
    className={`
      ${style.konyButton}
      ${style[type] ? style[type] : ''}
      ${style[color] ? style[color] : ''}
      ${active ? style.active : ''}
      ${selected ? style.selected : ''}
      ${featured ? style.featured : ''}
      ${className}
    `}
    onClick={onClick}
    href={href || null}
    target={target}
    disabled={disabled}
  >
    {renderDownloadIcon(type)}
    {renderCodeIcon(isCode)}
    {children || title}
    {checkSelected(selected)}
  </Button>
);

KonyButton.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.string,
  color: PropTypes.string,
  active: PropTypes.bool,
  featured: PropTypes.bool,
  selected: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  href: PropTypes.string,
  target: PropTypes.string,
  disabled: PropTypes.bool,
  isCode: PropTypes.bool,
};

KonyButton.defaultProps = {
  title: 'Button',
  type: 'normal',
  color: '',
  active: false,
  featured: false,
  selected: false,
  children: '',
  className: '',
  href: '',
  target: null,
  onClick: () => {},
  disabled: false,
  isCode: false,
};

export default KonyButton;
