import React from 'react';
import style from './style.scss';
import KonyButton from '../KonyButton';

const ComingSoonButton = ({ href, disabled, isLogin, submit, hideNotify }) => (
  <div className={`${style.assetButtons} ${style.comingSoon} ${isLogin ? style.pushLeft : null}`} >
    <KonyButton
      key={1}
      title="Coming Soon.."
      className={style.transparentBg}
    />
    {
      !hideNotify ? (
        <KonyButton
          disabled={disabled}
          key={2}
          title="Notify Me"
          href={isLogin ? false : href}
          type="action"
          className={`${style.mobileBtn} notifyBtn`}
          color="blue"
          onClick={submit}
        />
      ) : null
    }
  </div>
);

export default ComingSoonButton;
