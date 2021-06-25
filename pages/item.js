import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import _find from 'lodash/find';
import MetaTags from '../src/components/MetaTags';
import { marketplaceActions } from '../src/actions';
import initialize, { getUrl } from '../src/utils/initialize';
import KonyLayout from '../src/components/KonyLayout';
import KonyBreadcrumb from '../src/components/KonyBreadcrumb';
import DetailTabs from '../src/components/DetailTabs';
import DetailMobileMeta from '../src/components/DetailMobileMeta';
import KonyLoader from '../src/components/KonyLoader';
import style from './style.scss';
import { loadScript } from '../src/utils';
import { oauthEnv } from '../src/config/settings';
import { getCookie } from '../src/utils/cookies';
import PageNotFound from '../src/components/PageNotFound';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeAsset: this.props.marketplace.currentAsset.selectedAsset,
      assetTitle: this.props.marketplace.currentAsset.assetTitle,
      itemId: this.props.marketplace.currentAsset.itemId,
    };
  }

  static async getInitialProps(ctx) {
    await initialize(ctx);
    await ctx.store.dispatch(marketplaceActions.getConfig(true));
    let platform = '';
    if (ctx.query.platform || ctx.req?.cookies.platform) {
      platform = ctx.query.platform || ctx.req?.cookies.platform;
    }
    let nfiversion = '';
    if (ctx.query.nfiversion || ctx.req?.cookies.nfiversion) {
      nfiversion = ctx.query.nfiversion || ctx.req?.cookies.nfiversion;
    }
    if (ctx.query && ctx.query.item) {
      await ctx.store.dispatch(marketplaceActions.getAssetDetails(ctx.query.item, platform, nfiversion));
    }
  }

  async componentDidMount() {
    if (this.props.marketplace.isVizWeb) {
      const platform = getCookie('platform', {});
      const nfiversion = getCookie('nfiversion', {});
      await this.props.getAssetDetails(this.props.url.query.item, platform, nfiversion);
      await this.setState({
        activeAsset: this.props.marketplace.currentAsset.selectedAsset,
      });
      loadScript(`${publicRuntimeConfig.asset}/static/dist/js/visualizer.js`);
    }
    window.dataLayer.push({
      assetTitle: this.props.marketplace.currentAsset.assetTitle,
      assetAlias: this.props.url.asPath,
    });
  }

  changeAsset = (id) => {
    this.setState({ activeAsset: _find(this.props.marketplace.currentAsset.assetList, ['ID', Number(id)]) });
  };

  assetDetails(currentAsset) {
    const asset = this.state.activeAsset;
    const { assetTitle, itemId } = this.state;
    const { query } = this.props.url;
    const { isVizWeb } = this.props.marketplace;
    const subRoutes = [];
    if (query && query.search) {
      subRoutes.push({
        name: query.search,
        path: getUrl(`/search/${query.search}`, [], isVizWeb),
      });
    }

    if (assetTitle && itemId && !asset) {
      return <PageNotFound />;
    }

    if (!asset && this.props.marketplace.isVizWeb) {
      return <KonyLoader />;
    }

    if (asset.length === 0 || !asset.ID) {
      return <KonyLoader />;
    }
    return (
      <Row gutter={16} className={`${style.detailPageWrapper} mpDetailPage`}>
        <MetaTags
          title={currentAsset.assetTitle}
          url={`https://marketplace.${oauthEnv}kony.com/items/${this.props.url.query.item}`}
          image={currentAsset.selectedAsset.Logo}
          description={currentAsset.selectedAsset.Description}
          keywords={`${currentAsset.assetTitle} , HCL Volt MX Tutorials , ${currentAsset.selectedAsset.platformVersion}`}
        />
        <Col span={24}>
          <KonyBreadcrumb title={currentAsset.assetTitle} subRoutes={subRoutes} />
        </Col>
        <Col span={24}>
          <Col md={24} lg={0} sm={24} xs={24} className={style.mobileMetaWrapper}>
            <DetailMobileMeta
              asset={asset}
              totalAssets={currentAsset.totalAssets}
              metaDetails={currentAsset.metaDetails}
              changeAsset={id => this.changeAsset(id)}
              title={currentAsset.assetTitle}
              itemId={currentAsset.itemId}
              isLiked={currentAsset.isLiked}
              url={this.props.url}
              isVizWeb={this.props.marketplace.isVizWeb}
              isCoreAsset={currentAsset.isCoreAsset}
              isContactUs={currentAsset.isContactUs}
              isNotified={currentAsset.isNotified}
            />
          </Col>
          <DetailTabs
            {...asset}
            totalAssets={currentAsset.totalAssets}
            metaDetails={currentAsset.metaDetails}
            changeAsset={id => this.changeAsset(id)}
            title={currentAsset.assetTitle}
            itemId={currentAsset.itemId}
            isLiked={currentAsset.isLiked}
            url={this.props.url}
            isVizWeb={this.props.marketplace.isVizWeb}
            isCoreAsset={currentAsset.isCoreAsset}
            isContactUs={currentAsset.isContactUs}
            isNotified={currentAsset.isNotified}
          />
        </Col>
      </Row>
    );
  }

  render() {
    const { config, currentAsset } = this.props.marketplace;
    return (
      <KonyLayout config={config} url={this.props.url}>
        <div>
          {
            this.assetDetails(currentAsset)
          }
        </div>
      </KonyLayout>
    );
  }
}

const mapStateToProps = ({ marketplace }) => ({ marketplace });

const mapDispatchToProps = dispatch => bindActionCreators({ ...marketplaceActions }, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailPage);
