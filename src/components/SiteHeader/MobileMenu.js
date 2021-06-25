import React, { Component } from 'react';
import Row from 'antd/lib/row';
import PropTypes from 'prop-types';
import Col from 'antd/lib/col';
import Icon from 'antd/lib/icon';
import { slide as Menu } from 'react-burger-menu';
import style from './style.scss';
import MobileMenuPanel from './MobileMenuPanel';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

class MobileMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
  }

  handleStateChange(state) {
    this.setState({ menuOpen: state.isOpen });
  }

  closeMenu = () => {
    this.setState({ menuOpen: false });
  }

  render() {
    return (
      <div className={style[this.props.className]}>
        <Menu
          right
          noOverlay
          disableOverlayClick
          isOpen={this.state.menuOpen}
          onStateChange={state => this.handleStateChange(state)}
          className={style.mobileMenuWrapper}
          burgerButtonClassName={style.hamburgerMenu}
          customBurgerIcon={
            <div>
              <img
                src={`${publicRuntimeConfig.asset}/static/dist/images/hamburgerMenuIcon.svg`}
                alt="Facebook icon"
                className={style.hamburgerMenuIcon}
              />
            </div>}
        >
          <Row className={style.mobileMenuPanel}>
            <Col span={24} className={style.mobileMenuHeader}>
              <Icon
                type="close"
                theme="outlined"
                onClick={e => this.closeMenu(e)}
                className={style.mobileMenuCloseButton}
              />
            </Col>
            <MobileMenuPanel
              menus={this.props.menus}
              name={this.props.name}
              cloudMenu={this.props.cloudMenu}
              url={this.props.url}
            />
          </Row>
        </Menu>
      </div>
    );
  }
}

MobileMenu.propTypes = {
  className: PropTypes.string,
};

MobileMenu.defaultProps = {
  className: '',
};

export default MobileMenu;
