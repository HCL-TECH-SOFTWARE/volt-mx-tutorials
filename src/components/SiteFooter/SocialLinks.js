import React from 'react';
import PropTypes from 'prop-types';
import style from './style.scss';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const SocialLinks = () => (
  <div className={style.socialLinksContainer}>
    <a
      className={style.companyLogo}
      href="https://www.facebook.com/KonyInc"
      target="_blank"
      title="Facebook"
      rel="noreferrer"
    >
      <img
        src={`${publicRuntimeConfig.asset}/static/dist/images/facebookIcon.svg`}
        alt="Facebook icon"
      />
    </a>
    <a
      className={style.companyLogo}
      href="https://www.linkedin.com/company/kony-inc"
      target="_blank"
      title="LinkedIn"
      rel="noreferrer"
    >
      <img
        src={`${publicRuntimeConfig.asset}/static/dist/images/linkedinIcon.svg`}
        alt="LinkedIn icon"
      />
    </a>
    <a
      className={style.companyLogo}
      href="https://twitter.com/Kony"
      target="_blank"
      title="Twitter"
      data-aura-rendered-by="273:0"
      rel="noreferrer"
    >
      <img
        src={`${publicRuntimeConfig.asset}/static/dist/images/twitter.svg`}
        alt="twitter icon"
      />
    </a>
    <a
      className={style.companyLogo}
      href="https://www.youtube.com/user/KonySolutionsTV"
      target="_blank"
      title="YouTube"
      data-aura-rendered-by="275:0"
      rel="noreferrer"
    >
      <img
        src={`${publicRuntimeConfig.asset}/static/dist/images/youtube.svg`}
        alt="youtube icon"
      />
    </a>
    <a
      className={style.companyLogo}
      href="https://www.glassdoor.com/Overview/Working-at-Kony-EI_IE306538.11,15.htm"
      target="_blank"
      title="glassdoor"
      data-aura-rendered-by="277:0"
      rel="noreferrer"
    >
      <img
        src={`${publicRuntimeConfig.asset}/static/dist/images/glassdoor.svg`}
        alt="glassdoor icon"
      />
    </a>
  </div>
);

SocialLinks.propTypes = {
  content: PropTypes.string,
};

SocialLinks.defaultProps = {
  content: '',
};

export default SocialLinks;
