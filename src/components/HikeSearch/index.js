import React, { Component } from 'react';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Col from 'antd/lib/col';
import Modal from 'antd/lib/modal';
import Router from 'next/router';
import getConfig from 'next/config';
import style from './style.scss';
import { BASE_PATH_URL, isDev } from '../../config';
import i18next from '../../../i18n';

const { publicRuntimeConfig } = getConfig();
class HikeSearch extends Component {
  state = {
    keyword: this.props.keyword || '',
  };

  handleSearchClick = () => {
    this.handleSubmit(document.getElementById('search').value);
  };

  handleSubmit = (keyword) => {
    const searchTerm = keyword.trim().replace(/\\|\/|  +/g, ' ');
    if (searchTerm.length > 2) {
      const URL = !isDev ? BASE_PATH_URL : '';
      const params = new URLSearchParams({
        ...Router.query,
        keyword: searchTerm,
      });
      const searchUrl = `${URL}/hikes/search?${params.toString()}`;
      Router.replace(searchUrl);
    } else {
      Modal.error({
        title: i18next.t('search_min_char_limit', { count: 3 }),
      });
      return false;
    }
  };

  render() {
    return (
      <div className={style.searchWrapper} ref={this.setWrapperRef}>
        <Col span={24} className={style.innerWrapper}>
          <Input
            id="search"
            placeholder={i18next.t('search')}
            className={style.input}
            onPressEnter={e => this.handleSubmit(e.target.value)}
            autoComplete="off"
            defaultValue={this.state.keyword}
          />
          <Button
            type="primary"
            shape="circle"
            size="default"
            className={style.searchIcon}
            onClick={this.handleSearchClick}
          >
            <img
              src={`${publicRuntimeConfig.asset}/static/dist/images/search.svg`}
              alt="search icon"
            />
          </Button>
        </Col>
      </div>
    );
  }
}

export default HikeSearch;
