import React, { Component } from 'react';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Col from 'antd/lib/col';
import Modal from 'antd/lib/modal';
import Icon from 'antd/lib/icon';
import style from './style.scss';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

class AnalyticsSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSearchClick = () => {
    this.handleSubmit(document.getElementById('analyticsSearch').value);
  };

  handleSubmit = (keyword) => {
    const searchTerm = keyword.trim().replace(/\\|\/|  +/g, ' ');
    if (searchTerm.length > 2) {
      this.setState({
        submit: true,
      });
      this.props.filterData(keyword);
    } else {
      Modal.error({
        title: 'Please enter minimum 3 characters',
      });
      return false;
    }
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => record[dataIndex]
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ keyword: selectedKeys[0] });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ keyword: '' });
  };

  render() {
    return (
      <div className={style.searchWrapper} ref={this.setWrapperRef}>
        <Col span={24} className={style.innerWrapper}>
          <Input
            id="analyticsSearch"
            placeholder= {this.props.placeholder}
            className={style.input}
            onPressEnter={e => this.handleSubmit(e.target.value)}
            autoComplete="off"
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
        </Col>
      </div>
    );
  }
}

export default AnalyticsSearch;
