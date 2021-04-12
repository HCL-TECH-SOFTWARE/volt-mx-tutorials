import React, { Component } from 'react';
import Divider from 'antd/lib/divider';
import Router from 'next/router';
import { includes, xor, omit, size } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { urlRedirect } from '../../utils/initialize'
import { validateData } from '../../utils';
import { assetActions } from '../../actions';
import FilterSubPanel from './FilterSubPanel';
import KonyButton from '../../components/KonyButton';
import style from './style.scss';

const isKeysEmpty = (obj) => {
  if (!obj) {
    return false;
  }
  const keys = Object.keys(obj);
  let res = true;
  if (keys.length > 0) {
    keys.forEach(key => {
      if (validateData(obj[key])) {
        res = false;
      }
    });
  };
  return res;
}

class FilterPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: { ...this.props.assets.filters } || {},
      selectedFilters: { ...this.props.assets.selectedFilters } || {},
      reset: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.assets.filters !== nextProps.assets.filters) {
      this.setState({
        filters: nextProps.assets.filters
      });
    }
  }

  handleReset = async () => {
    this.setState({
      selectedFilters: { tags: [], category: [], channels: [] },
    });
  };

  handleApply = async () => {
    const { reset } = this.state;
    let { selectedFilters } = this.state;
    const { query } = this.props.url;
    let path = '/';
    if (reset) {
      path = '/';
      selectedFilters = {};
    }
    if (query.author) {
      path = `/author/${query.author}`;
      urlRedirect(path, omit(selectedFilters, ['cloudId', 'author']));
    } else if (query.cloudId) {
      path = `/cloud/${query.cloudId}`;
      urlRedirect(path, omit(selectedFilters, ['domain', 'cloudId']));
    } else if (selectedFilters.domain) {
      path = `/domain/${selectedFilters.domain}`;
      urlRedirect(path, omit(selectedFilters, ['domain', 'cloudId']));
    } else if ((size(selectedFilters) > 0) && !isKeysEmpty(selectedFilters)) {
      path = '/r';
      urlRedirect(path, selectedFilters);
    } else {
      urlRedirect(path);
    }
    this.props.close();
    window.scrollTo(0, 0);
  };

  getSubDomains(name, domains) {
    if (domains.length > 0) {
      const selectedDomain = domains.filter(item => item.slug === name);
      if (selectedDomain.length > 0) {
        return domains.filter(
          item => Number(item.parent) === Number(selectedDomain[0]['domainId'])
        );
      }
    }
    return [];
  }

  toggleFilterSelection = (filter, id) => {
    let tempSelected = this.state.selectedFilters;
    if ('tags' === filter || 'category' === filter || 'channels' === filter) {
      tempSelected[filter] = this.state.selectedFilters[filter] || [];
      if (_.includes(tempSelected[filter], id.toString())) {
        tempSelected[filter] = xor(tempSelected[filter], [id.toString()]);
      } else {
        tempSelected[filter] = xor(tempSelected[filter], [id.toString()]);
      }
    } else if (filter === 'domain') {
      if (tempSelected[filter] === id) {
        delete tempSelected[filter];
        delete tempSelected['subdomain'];
      } else {
        tempSelected[filter] = id.toString();
        if (filter === 'domain') {
          delete tempSelected['subdomain'];
        }
      }
    } else {
      if (tempSelected[filter] === id) {
        delete tempSelected[filter];
      } else {
        tempSelected[filter] = id.toString();
      }
    }

    this.setState({
      selectedFilters: tempSelected
    });
  };

  setFilterEach = (filter, selected) => {
    if (!selected) {
      return filter.map(item => ({ ...item, selected: false }));
    } else {
      return filter.map(
        item =>
          item.id.toString() === selected.toString()
            ? { ...item, selected: true }
            : { ...item, selected: false }
      );
    }
  };
  getAppliedFilters = (filters, selected) => {
    let tempFilters = filters;
    if (!selected) {
      return tempFilters;
    }

    tempFilters.platform = this.setFilterEach(tempFilters.platform, selected.platform);
    tempFilters.domain = this.setFilterEach(tempFilters.domain, selected.domain);
    tempFilters.channels = this.setFilterEach(tempFilters.channels, selected.channels);
    tempFilters.subdomain = this.setFilterEach(tempFilters.domain, selected.subdomain);
    tempFilters.mpType = this.setFilterEach(tempFilters.mpType, selected.mpType);
    tempFilters.nfiversion = this.setFilterEach(tempFilters.nfiversion, selected.nfiversion);
    if (selected.category) {
      tempFilters.category = tempFilters.category.map(
        categoryItem =>
          includes(selected.category, categoryItem.id.toString())
            ? { ...categoryItem, selected: true }
            : { ...categoryItem, selected: false }
      );
    }
    if (selected.channels) {
      tempFilters.channels = tempFilters.channels.map(
        channelsItem =>
          includes(selected.channels, channelsItem.id.toString())
            ? { ...channelsItem, selected: true }
            : { ...channelsItem, selected: false }
      );
    }
    if (selected.tags) {
      tempFilters.tags = tempFilters.tags.map(
        tagsItem =>
          includes(selected.tags, tagsItem.id.toString())
            ? { ...tagsItem, selected: true }
            : { ...tagsItem, selected: false }
      );
    }
    return tempFilters;
  };

  render() {
    const { filters, selectedFilters } = this.state;
    const { isVizWeb } = this.props.marketplace;

    const tempFilters = this.getAppliedFilters(filters, this.state.selectedFilters);
    return (
      <div>
        {isVizWeb ? (<FilterSubPanel
          title="Marketplace Type"
          filter="mpType"
          listOfSelections={tempFilters.mpType}
          handleSelect={this.toggleFilterSelection}
        />) : null}
        {this.props.url.query.cloudId ? null : (
          <FilterSubPanel
            title="Domain"
            filter="domain"
            listOfSelections={tempFilters.domain.filter(item => Number(item.parent) === 0)}
            handleSelect={this.toggleFilterSelection}
          />
        )}
        {selectedFilters.domain ? (
          <FilterSubPanel
            title="Sub Domain"
            filter="subdomain"
            listOfSelections={this.getSubDomains(selectedFilters.domain, tempFilters.subdomain)}
            handleSelect={this.toggleFilterSelection}
          />
        ) : null}

        <FilterSubPanel
          title="Channels"
          filter="channels"
          listOfSelections={tempFilters.channels}
          handleSelect={this.toggleFilterSelection}
        />
        <FilterSubPanel
          title="Category"
          filter="category"
          listOfSelections={tempFilters.category}
          handleSelect={this.toggleFilterSelection}
        />
        {!isVizWeb ? (<FilterSubPanel
          title="NFI"
          filter="nfiversion"
          listOfSelections={tempFilters.nfiversion}
          handleSelect={this.toggleFilterSelection}
        />) : null}

        {!isVizWeb ? (<FilterSubPanel
          title="Platform"
          filter="platform"
          listOfSelections={tempFilters.platform}
          handleSelect={this.toggleFilterSelection}
        />) : null}
        <FilterSubPanel
          title="Tags"
          filter="tags"
          listOfSelections={tempFilters.tags}
          handleSelect={this.toggleFilterSelection}
        />
        <div className={style.actionWrapper}>
          <KonyButton
            className={style.filterCancel}
            title="Clear"
            type="action"
            onClick={this.handleReset}
          />
          <KonyButton
            className={style.filterApply}
            title="Apply"
            type="action"
            color="blue"
            onClick={this.handleApply}
          />
        </div>
      </div>
    );
  }
}

FilterPanel.propTypes = {};

FilterPanel.defaultProps = {};

const mapStateToProps = ({ assets, marketplace }) => ({ assets, marketplace });

const mapDispatchToProps = dispatch => bindActionCreators({ ...assetActions }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPanel);
