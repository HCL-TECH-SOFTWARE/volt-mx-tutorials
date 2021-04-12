import React from 'react';
import style from './style.scss';
import KonyButton from '../KonyButton';

const ContactUsButton = ({ disabled, href, isLogin,submit }) => (
  <KonyButton
    disabled={disabled}
    title="Contact Us"
    href={isLogin? false: href}
    type="action"
    color="blue"
    className={`${style.assetButtons} ${style.mobileBtn} ${isLogin ? style.pushLeft : null} contactBtn`}
    onClick={submit}
  />
);

export default  ContactUsButton;
