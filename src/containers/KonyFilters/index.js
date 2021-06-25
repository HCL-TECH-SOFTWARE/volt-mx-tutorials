import React, { Component } from 'react';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Row from 'antd/lib/row';
import PropTypes from 'prop-types';
import Col from 'antd/lib/col';
import Menu from 'react-burger-menu/lib/menus/slide';
import style from './style.scss';
import FilterPanel from './FilterPanel';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

class KonyFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
  }

  toggleMenu(e) {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  handleStateChange(state) {
    this.setState({ menuOpen: state.isOpen });
  }

  closeMenu = () => {
    this.setState({ menuOpen: false });
  }

  render() {
    return (
      <div>
        <Menu
          right
          isOpen={this.state.menuOpen}
          onStateChange={state => this.handleStateChange(state)}
          className={style.filterWrapper}
          overlayClassName={style.overlay}
          burgerButtonClassName={style.hide}
        >
          <Button
            onClick={e => this.toggleMenu(e)}
            className={`${style.filterOpenButton} ${this.props.viz ? style.viz : ''} ${this.props.vizApp ? style.vizApp : ''}`}
          >
            <img src={`${publicRuntimeConfig.asset}/static/dist/images/filter.svg`} alt="filter icon" />
          </Button>
          <Row className={style.filterPanel}>
            <Col xs={0} sm={0} md={24} lg={24} className={style.filterHeaderPanel}>
              <h3 className={style.filterHeading}>Filters:</h3>
              <img
                src={`${publicRuntimeConfig.asset}/static/dist/images/icons/filterCross.svg`}
                alt="icon"
                onClick={e => this.closeMenu(e)}
                className={style.filterCloseButton}
              />
            </Col>
            <Col xs={24} sm={24} md={0} lg={0} className={style.mobileFilterHeaderPanel}>
              <Col span={22} className={style.mobileFilterHeading}>
                <h3>FILTERS</h3>
              </Col>
              <Col>
                <img
                  src={`${publicRuntimeConfig.asset}/static/dist/images/icons/filterCrossMobile.svg`}
                  alt="icon"
                  onClick={e => this.closeMenu(e)}
                  className={style.mobileFilterCloseButton}
                />
              </Col>
            </Col>
            <FilterPanel close={this.closeMenu} url={this.props.url} />
          </Row>
        </Menu>
      </div>
    );
  }
}

KonyFilters.propTypes = {
  vizApp: PropTypes.bool,
  viz: PropTypes.bool,
};

KonyFilters.defaultProps = {
  vizApp: false,
  viz: false,
};

export default KonyFilters;
