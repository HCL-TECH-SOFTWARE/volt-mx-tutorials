import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/lib/row';
import { connect } from 'react-redux';
import Col from 'antd/lib/col';
import style from './style.scss';
import SocialLinks from './SocialLinks';

class SiteFooter extends Component {
  render() {
    return (
      <Row
        span={24}
        className={`nocontent ${style.footerContainer} ${this.props.marketplace.isVizWeb
         || this.props.marketplace.isVizApp ? style.hide : null}`}
      >
        <Col span={24}>
          <div className={style.footer}>
            <SocialLinks />
          </div>
          <p className={style.footer}>{this.props.content}</p>
          <div className={style.footer}>
            <a
              className={style.privacyPolicy}
              href="https://www.kony.com/privacy-policy"
              target="_blank"
              rel="noreferrer"
            >
              Privacy Statement
            </a>
          </div>
        </Col>
      </Row>
    );
  }
}

SiteFooter.propTypes = {
  content: PropTypes.string,
};

SiteFooter.defaultProps = {
  content: '',
};

const mapStateToProps = ({ marketplace }) => ({ marketplace });

export default connect(mapStateToProps)(SiteFooter);
