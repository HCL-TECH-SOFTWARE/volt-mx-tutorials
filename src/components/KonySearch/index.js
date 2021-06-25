import React, { Component } from 'react';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Col from 'antd/lib/col';
import Modal from 'antd/lib/modal';
import Icon from 'antd/lib/icon';
import _map from 'lodash/map';
import _debounce from 'lodash/debounce';
import _filter from 'lodash/filter';
import axios from 'axios';
import { baseURL } from '../../config/settings';
import style from './style.scss';
import { urlRedirect } from '../../utils/initialize';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const { CancelToken } = axios;
let cancelSearchAutoCompleteCall = CancelToken.source();

class KonySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      autocompleteLoading: false,
      response: [],
      showAutoCompleteDropdown: true,
      submit: false,
    };
    this.searchInputTag = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    document.getElementById('search').value = this.props.selectedFilters ? this.props.selectedFilters.keyword || '' : '';

    window.onkeyup = (event) => {
      if (event.keyCode === 27) {
        this.closeAutoComplete();
      }
    };
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.closeAutoComplete();
    }
  };

  closeAutoComplete = () => {
    this.setState({
      showAutoCompleteDropdown: false,
    });
  };

  openAutoComplete = () => {
    this.setState({
      showAutoCompleteDropdown: true,
    });
  };

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  handleAutoComplete = _debounce(async (searchTerm) => {
    const text = searchTerm.trim().replace(/\\|\/|  +/g, ' ');
    this.setState({ keyword: text, showAutoCompleteDropdown: false });
    if (text.length > 2) {
      try {
        cancelSearchAutoCompleteCall = CancelToken.source();
        this.setState({
          autocompleteLoading: true,
        });
        let resData = [];
        try {
          const res = await axios.get(`${baseURL}marketplace/search-autocomplete/${text}`, {
            headers: {
              'Cache-Control': 'no-cache'
            },
            cancelToken: cancelSearchAutoCompleteCall.token,
          });
          resData = res.data;
        } catch (error) {
          resData = [];
        }
        this.setState({
          response: resData,
          autocompleteLoading: false,
        });
        this.openAutoComplete();
      } catch (error) {
        this.setState({
          response: [],
          autocompleteLoading: false,
        });
      }
      if (this.state.response.length === 0) {
        window.dataLayer.push({
          page: `/search/?s=${this.state.keyword}`,
          event: 'gtm.dom',
        });
        this.setState({
          response: [],
          autocompleteLoading: false,
        });
      }
    }
  }, 200);

  assetClick = (label, alias) => {
    window.dataLayer.push({
      'assetTitle': label,
      'assetAlias': alias,
      'event': 'assetClick'
    })
    this.searchInputTag.current.input.value = label;
    this.searchInputTag.current.focus();
    this.closeAutoComplete();
  }

  renderDropdownItems = (item, i) => {
    if (item.message) {
      return (<li key={i} className={style.noResultMessage}>{item.message}</li>);
    }
    return (
      <li key={i}>
        <a
          onClick={() => this.assetClick(item.label, item.alias)}
        >
          {
            item.label
          }
        </a>
      </li>
    );
  };

  handleSearchClick = () => {
    this.handleSubmit(document.getElementById('search').value);
  };

  handleSubmit = (keyword) => {
    const searchTerm = keyword.trim().replace(/\\|\/|  +/g, ' ');
    if (searchTerm.length === 0) {
      if (window.location.pathname !== "/") {
        urlRedirect('/');
      }
      return;
    }
    if (searchTerm.length > 2) {
      this.setState({
        autocompleteLoading: false,
        submit: true,
      });
      this.closeAutoComplete();
      axios.get(`${baseURL}/marketplace/search/keyword/${searchTerm}`);
      window.dataLayer.push({
        page: `/search/?s=${searchTerm}`,
        event: 'gtm.dom',
      });
      const searchUrl = `/search/${searchTerm}`;
      urlRedirect(searchUrl);
    } else {
      Modal.error({
        title: 'Please enter minimum 3 characters',
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
            placeholder="Search For Marketplace Assets"
            className={`_1t_td4YBkaszRnM2tg ${style.input}`}
            onChange={e => this.handleAutoComplete(e.target.value)}
            onPressEnter={e => this.handleSubmit(e.target.value)}
            onClick={this.openAutoComplete}
            onFocus={this.openAutoComplete}
            autoComplete="off"
            aria-label="Search"
            ref={this.searchInputTag}
          />
          <Button
            type="primary"
            shape="circle"
            size="default"
            className={style.searchIcon}
            onClick={this.handleSearchClick}
          >
            <img src={`${publicRuntimeConfig.asset}/static/dist/images/search.svg`} alt="search icon" />
          </Button>
          <Icon
            type="loading"
            theme="outlined"
            className={`anticon-spin ${style.spinner} ${!this.state.submit && this.state.autocompleteLoading ? style.show : style.hide}`}
          />
          {
            !this.state.submit && this.state.showAutoCompleteDropdown === true
              && this.state.response && this.state.response.length > 0
              && this.state.keyword.length > 2 ? (
                <div
                  id="searchAutocomplete"
                  className={style.dropdown}
                >
                  <ul>
                    {
                      this.state.response && this.state.response.length > 0
                        ? _map(this.state.response, (item, i) => this.renderDropdownItems(item, i)) : ''
                    }
                  </ul>
                </div>
              ) : null
          }
        </Col>
      </div>
    );
  }
}

export default KonySearch;
