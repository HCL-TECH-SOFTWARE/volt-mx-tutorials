import React, { Component } from 'react';
import Icon from 'antd/lib/icon';
import PropTypes from 'prop-types';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import { connect } from 'react-redux';
import { instance as axios } from '../../utils/initialize';
import style from './style.scss';

const mpItemLike = async id => axios
  .get(`api/v1_1/marketplace/item/${id}/like`)
  .then(res => res.status)
  .catch((error) => {
    console.log(error);
  });

export class KonyLike extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.isLiked,
      isLoading: false,
      buttonText: this.props.isLiked ? 'Liked' : 'Like',
    };
  }

  likeButtonclick(e) {
    e.preventDefault();
    if (!this.state.checked) {
      this.setState({ isLoading: true });
      mpItemLike(this.props.id)
        .then((statusCode) => {
          if (statusCode === 200) {
            this.setState({ isLoading: false, checked: true, buttonText: 'Liked' });
          } else {
            this.setState({ isLoading: false });
          }
        })
        .catch(() => this.setState({ isLoading: false }));
    }
  }

  render() {
    const { marketplace } = this.props;
    return (
      marketplace.isLogin || marketplace.isVizWeb
        ? (
          <div className={style.likeWrapper}>
            <Col xs={0} sm={0} md={0} lg={24}>
              <Button className={`${style.likeButton} ${this.state.checked ? style.selected : null}`} onClick={e => this.likeButtonclick(e)}>
                <Icon
                  type="heart"
                  className={`${style.icon} ${this.state.isLoading ? style.hide : null}`}
                  theme={this.state.checked ? 'filled' : 'outlined'}
                />
                <Icon
                  type="loading"
                  className={`${style.icon} ${this.state.isLoading ? null : style.hide}`}
                  theme="outlined"
                />
                <span>{this.state.buttonText}</span>
              </Button>
            </Col>
            <Col xs={24} sm={24} md={24} lg={0}>
              <Icon
                type="heart"
                className={`${style.mobileIcon} ${this.state.isLoading ? style.hide : null}`}
                onClick={e => this.likeButtonclick(e)}
                theme={this.state.checked ? 'filled' : 'outlined'}
              />
              <Icon
                type="loading"
                className={`${style.mobileIcon} ${this.state.isLoading ? null : style.hide}`}
                theme="outlined"
              />
            </Col>
          </div>
        )
        : null
    );
  }
}

KonyLike.propTypes = {
  id: PropTypes.number,
  isLiked: PropTypes.bool,
  marketplace: PropTypes.object,
};

KonyLike.defaultProps = {
  id: 0,
  isLiked: false,
  marketplace: {},
};

const mapStateToProps = ({ marketplace }) => ({ marketplace });

export default connect(mapStateToProps)(KonyLike);
