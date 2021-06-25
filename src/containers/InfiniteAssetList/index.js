import React, { Component } from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import _size from 'lodash/size';
import _omit from 'lodash/omit';
import _filter from 'lodash/filter';
import PropTypes from 'prop-types';
import Pagination from 'antd/lib/pagination';
import { urlRedirect } from '../../utils/initialize';
import style from './style.scss';
import AssetCard from '../../components/AssetCard';
import KonyBreadcrumb from '../../components/KonyBreadcrumb';
import SelectedFilters from '../../components/SelectedFilters';
import SortDropdown from '../../components/SortDropdown';
import NoResultFound from '../../components/NoResultFound';
import KonyLoader from '../../components/KonyLoader';

export default class AssetsList extends Component {
  state = {
    paginationNumber: 1,
    currentAssetsList: this.props.currentList,
  };

  handleSelect = (e) => {
    e.preventDefault();
    this.props.select();
  };

  onShowSizeChange = (current, pageSize) => {
    const { getAssets, assets } = this.props;
    this.setState({
      paginationNumber: current,
    });

    const key = (current - 1) * pageSize;
    if (!assets[key]) {
      getAssets(key);
    }
    this.setState({
      currentAssetsList: assets[key],
    });
  };

  itemRender = (current, type, originalElement) => {
    if (type === 'prev') {
      return <a className="ant-pagination-item-link"><i className="anticon anticon-right">Previous</i></a>;
    }
    if (type === 'next') {
      return <a className="ant-pagination-item-link"><i className="anticon anticon-right">Next</i></a>;
    }
    return originalElement;
  };

  selectFilter = (filter, id) => {
    const { selectedList } = this.props;
    let path = '/r';
    const omitList = ['cloudId'];
    if (selectedList.domain || selectedList.cloudId || selectedList.author) {
      if (selectedList.author) {
        path = `/author/${selectedList.author}`;
        omitList.push('author');
      } else if (selectedList.domain) {
        path = `/domain/${selectedList.domain}`;
        omitList.push('domain');
      } else if (selectedList.cloudId) {
        path = `/cloud/${selectedList.cloudId}`;
      }
    }

    if ((filter === 'category' || filter === 'tags' || filter === 'channels') && selectedList[filter].length > 1) {
      const tempSelected = selectedList;
      tempSelected[filter] = _filter(selectedList[filter], item => item !== id);
      urlRedirect(path, _omit(tempSelected, omitList));
    } else if (Object.keys(selectedList).length === 2 && selectedList.sortBy) {
      urlRedirect('/', _omit(selectedList, [...omitList, 'sortBy', filter]));
    } else {
      urlRedirect(path, _omit(selectedList, [...omitList, filter]));
    }
  };

  selectSortBy = (id) => {
    const { selectedList } = this.props;
    let path = '/r';
    const omitList = ['cloudId'];
    if (selectedList.domain || selectedList.cloudId || selectedList.author) {
      if (selectedList.author) {
        path = `/author/${selectedList.author}`;
        omitList.push('author');
      } else if (selectedList.domain) {
        path = `/domain/${selectedList.domain}`;
        omitList.push('domain');
      } else if (selectedList.cloudId) {
        path = `/cloud/${selectedList.cloudId}`;
      }
    }
    const tempSelected = { ...selectedList, sortBy: id };
    urlRedirect(path, _omit(tempSelected, omitList));
  };

  clearFilters = () => {
    const { selectedList } = this.props;
    let path = '/';
    if (selectedList.domain || selectedList.cloudId || selectedList.author) {
      if (selectedList.author) {
        path = `/author/${selectedList.author}`;
      } else if (selectedList.domain) {
        path = `/domain/${selectedList.domain}`;
      } else if (selectedList.cloudId) {
        path = `/cloud/${selectedList.cloudId}`;
      }
    }
    urlRedirect(path);
  };

  render() {
    const {
      title,
      filtersLoading,
      loading,
      filters,
      selectedList,
      total,
      isVizApp,
      searchKeyword,
      hideFilters,
      currentList,
      isViz,
    } = this.props;

    const { paginationNumber, currentAssetsList } = this.state;
    let assets = currentAssetsList;

    if (!currentAssetsList || currentAssetsList.length < 1) {
      const key = (paginationNumber - 1) * 10;
      assets = this.props.assets[key];
    }

    if (!assets || assets.length < 1) {
      assets = currentList;
    }

    if (!currentList || currentList.length < 1) {
      assets = [];
    }

    let hideDomain = false;
    const omitItems = ['sortBy', 'keyword', 'cloudId', 'author'];
    if (!selectedList.author) {
      omitItems.push('domain');
      hideDomain = true;
    }

    return (
      <div>
        <Row gutter={16} className={style.domainTitleWrapper}>
          {
            loading ? <KonyLoader inline className={style.assetListLoader} /> : null
          }
          <Col span={24}>
            {
              !filtersLoading
              && (!hideFilters
                && _size(_omit(selectedList, omitItems)) > 0) ? (
                  <SelectedFilters
                    filters={filters}
                    clear={this.clearFilters}
                    select={this.selectFilter}
                    hideDomain={hideDomain}
                  />
                ) : null
            }
            {
              assets.length > 0 ? (
                title ? <KonyBreadcrumb title={title} /> : null
              ) : null
            }
            {
              filters ? (
                <SortDropdown
                  menuItems={filters.sortBy}
                  sort={this.selectSortBy}
                  selected={selectedList.sortBy}
                  className={`${this.props.sortClassName || null} ${
                    assets.length > 0 ? null : style.hide
                  }`}
                />
              ) : null
            }
          </Col>
        </Row>
        <div>
          {
            assets.length > 0 ? (
              assets
                .map(asset => (
                  <Row
                    key={asset.ID}
                    className={style.assetCardContainer}
                    style={{ display: 'inline-block' }}
                  >
                    <AssetCard asset={asset} keyword={searchKeyword} />
                  </Row>
                ))
            )
              : null
          }
          {
            assets.length < 1
            && !loading ? (
              <NoResultFound
                noResult
                minHeight
                hideButton={isVizApp}
                isViz={isViz}
              />
              ) : (
                <div className={style.centerAlign}>
                  <Pagination
                    onChange={this.onShowSizeChange}
                    defaultCurrent={1}
                    className={`listPagination ${style.paginationContainer}`}
                    itemRender={this.itemRender}
                    defaultPageSize={10}
                    total={total}
                  />
                </div>
              )
          }
        </div>
      </div>
    );
  }
}

AssetsList.propTypes = {
  assets: PropTypes.object,
  title: PropTypes.string,
  errorMessage: PropTypes.string,
};

AssetsList.defaultProps = {
  title: '',
  assets: [],
};
