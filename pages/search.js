import React, { Component } from 'react';
import Row from 'antd/lib/row';
import _omit from 'lodash/omit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { marketplaceActions, assetActions } from '../src/actions';
import initialize, { urlRedirect } from '../src/utils/initialize';
import { loadScript } from '../src/utils';
import KonyLayout from '../src/components/KonyLayout';
import MarketplaceHeader from '../src/components/MarketplaceHeader';
import DidYouMean from '../src/components/DidYouMean';
import InfiniteAssetList from '../src/containers/InfiniteAssetList';
import KonyFilters from '../src/containers/KonyFilters';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

class SearchPage extends Component {
  static async getInitialProps(ctx) {
    await initialize(ctx);
    const { assets } = ctx.store.getState();
    await ctx.store.dispatch(marketplaceActions.getConfig());
    if (ctx.query?.useragent || ctx.req?.cookies?.useragent) {
      const useragent = ctx.query?.useragent || ctx.req?.cookies?.useragent;
      if (useragent.toLowerCase() !== 'visualizer') {
        await ctx.store.dispatch(
          assetActions.loadAssets(
            {
              count: 10,
              offset: 0,
            },
            assets.headers,
          ),
        );
      } else {
        await ctx.store.dispatch(assetActions.setAssetsLoading(true));
      }
    } else {
      await ctx.store.dispatch(
        assetActions.loadAssets(
          {
            count: 10,
            offset: 0,
          },
          assets.headers,
        ),
      );
    }
  }

  componentDidMount() {
    if (this.props.mp.isVizWeb) {
      loadScript(`${publicRuntimeConfig.asset}/static/dist/js/visualizer.js`);
      this.getInfiniteAssets(0);
    }
    this.props.loadFilters();
  }

  getInfiniteAssets = (offset) => {
    const { assets } = this.props;
    const { list } = assets;
    this.props.loadAssets(
      {
        count: 10,
        offset,
      },
      assets.headers,
      list,
    );
  };

  seeAllRedirect = () => {
    const keyword = this.props.url.query.keyword || '';
    if (this.props.assets.selectedFilters) {
      const tempSelected = this.props.assets.selectedFilters;
      tempSelected.keyword = keyword.trim();
      if (tempSelected.domain) {
        urlRedirect(`/domain/${tempSelected.domain}`, _omit(tempSelected, 'domain'));
      } else {
        urlRedirect('/r', _omit(tempSelected, 'domain'));
      }
    }
  };

  render() {
    const { mp, assets, url } = this.props;
    const { didyoumean } = assets;
    return (
      <KonyLayout config={mp.config} isLogin={mp.isLogin} url={this.props.url}>
        <Row className="mpSearchResultsPage">
          <MarketplaceHeader selectedParams={assets.selectedFilters} />
          <KonyFilters filters={assets.filters} viz={mp.isVizWeb} vizApp={mp.isVizApp} url={url} />
          {
            didyoumean ? <DidYouMean keyword={url.query.keyword} suggestion={didyoumean} /> : null
          }
          <InfiniteAssetList
            title={url.query.keyword}
            filters={this.props.assets.filters}
            selectedList={assets.selectedFilters}
            assets={assets.list}
            currentList={assets.currentList}
            load={false}
            getAssets={this.getInfiniteAssets}
            seeAll
            filtersLoading={assets.filtersLoading}
            seeAllRedirect={this.seeAllRedirect}
            isVizApp={mp.isVizApp}
            isViz={mp.isVizApp || mp.isVizWeb}
            searchKeyword={url.query.keyword}
            total={assets.totalAssetCount}
            loading={assets.loading}
          />
        </Row>
      </KonyLayout>
    );
  }
}

function mapStateToProps({ marketplace, assets }) {
  return {
    mp: marketplace,
    assets,
  };
}
const mapDispatchToProps = dispatch => bindActionCreators({ ...marketplaceActions, ...assetActions }, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);
