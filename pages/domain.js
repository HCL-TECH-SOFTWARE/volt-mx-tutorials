import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Row from 'antd/lib/row';
import _forEach from 'lodash/forEach';
import { Base64 } from 'js-base64';
import MetaTags from '../src/components/MetaTags';
import PageNotFound from '../src/components/PageNotFound';
import { marketplaceActions, assetActions } from '../src/actions';
import initialize from '../src/utils/initialize';
import KonyLayout from '../src/components/KonyLayout';
import MarketplaceHeader from '../src/components/MarketplaceHeader';
import InfiniteAssetList from '../src/containers/InfiniteAssetList';
import KonyFilters from '../src/containers/KonyFilters';
import { loadScript, capitalizeFirstLetter } from '../src/utils';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
class DomainPage extends Component {
  static async getInitialProps(ctx) {
    if (!ctx) {
      return null;
  }
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

  getcloudTitle = (url, mp) => {
    let tempTitle = url.query.cloudId;
    if (mp.cloudAccounts && mp.cloudAccounts.length > 0) {
      mp.cloudAccounts.map((cloud) => {
        if ((String(cloud?.account_id) === url.query.cloudId)) {
          tempTitle = `${capitalizeFirstLetter(cloud.account_title)} (${cloud?.account_id})`;
        }
      });
      return tempTitle;
    }
    return url.query.cloudId;
  };

  checkCloudAccount = (url, cloudAccounts) => {
    let iscloudMatch = false;
    _forEach(cloudAccounts, (cloud) => {
      if (Number(url.query.cloudId) === Number(cloud?.account_id)) {
        iscloudMatch = true;
      }
    });
    return iscloudMatch;
  };

  getBreadCrumbTitle = () => {
    const { mp, url } = this.props;
    const {
      domain, cloudId, channels, keyword, author,
    } = url.query;
    if (cloudId) {
      return this.getcloudTitle(url, mp);
    }
    if (author) {
      try {
        const decodedAuthor = Base64.decode(author);
        if (decodedAuthor) {
          return decodedAuthor.split('::')[0];
        }
      } catch (error) {
        return author;
      }
    }
    if (domain) {
      return capitalizeFirstLetter(domain);
    }
    if (channels) {
      return this.getChannelTitle(url);
    }
    if (keyword) {
      return keyword;
    }
  };

  getChannelTitle = (url) => {
    const { channels } = url.query;
    if (channels && !Array.isArray(channels)) {
      if (url.asPath && url.asPath.includes('/channels/')) {
        return capitalizeFirstLetter(channels);
      }
    }
  };

  render() {
    const { mp, assets, url } = this.props;
    const {
      cloudAccounts, config, isLogin, isVizApp, isVizWeb,
    } = mp;
    if (url.query.cloudId && !this.checkCloudAccount(url, cloudAccounts)) {
      return (
        <KonyLayout config={config} isLogin={isLogin} url={url}>
          <MetaTags title={capitalizeFirstLetter(url.query.domain) || url.query.keyword} />
          <MarketplaceHeader selectedParams={assets.selectedFilters} />
          <PageNotFound />
        </KonyLayout>
      );
    }
    return (
      <KonyLayout config={mp.config} isLogin={mp.isLogin} url={this.props.url}>
        <MetaTags title={this.getBreadCrumbTitle()} />
        <Row className="mpDomainPage">
          <MarketplaceHeader selectedParams={assets.selectedFilters} />
          <KonyFilters
            filters={assets.filters}
            viz={mp.isVizWeb}
            vizApp={mp.isVizApp}
            url={url}
          />
          <InfiniteAssetList
            title={this.getBreadCrumbTitle()}
            filters={this.props.assets.filters}
            selectedList={assets.selectedFilters}
            assets={assets.list}
            currentList={assets.currentList}
            load={assets.loadMore}
            getAssets={this.getInfiniteAssets}
            filtersLoading={assets.filtersLoading}
            isVizApp={isVizApp}
            isViz={isVizApp || isVizWeb}
            searchKeyword={url.query.keyword}
            hideFilters={this.getChannelTitle(url)}
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
)(DomainPage);
