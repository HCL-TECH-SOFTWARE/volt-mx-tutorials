import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import MetaTags from '../src/components/MetaTags';
import { marketplaceActions, assetActions } from '../src/actions';
import initialize from '../src/utils/initialize';
import styles from './style.scss';
import MarketplaceHeader from '../src/components/MarketplaceHeader';
import KonyButton from '../src/components/KonyButton';
import AssetsList from '../src/components/AssetsList';
import FeaturedList from '../src/components/FeaturedList';
import KonyLayout from '../src/components/KonyLayout';
import KonyFilters from '../src/containers/KonyFilters';
import { loadScript } from '../src/utils';
import ProposeComponentWrapper from '../src/components/ProposeComponentWrapper';

class MpLanding extends Component {
  static async getInitialProps(ctx) {
    ctx.store.dispatch(assetActions.setSelectedFilters({}));
    await initialize(ctx);
    if (ctx.query && (ctx.query.nfiversion || ctx.query.platform)) {
      if (ctx.query.platform && !ctx.query.nfiversion) {
        const { platform } = ctx.query;
        await ctx.store.dispatch(marketplaceActions.getConfig(false, platform));
      } else if (ctx.query.nfiversion && !ctx.query.platform) {
        const { nfiversion } = ctx.query;
        await ctx.store.dispatch(marketplaceActions.getConfig(false, 'all', nfiversion));
      } else {
        const { platform, nfiversion } = ctx.query;
        await ctx.store.dispatch(marketplaceActions.getConfig(false, platform, nfiversion));
      }
    } else if (ctx.req && ctx.req?.cookies
      && (ctx.req?.cookies.platform || ctx.req?.cookies.nfiversion)) {
      if (ctx.req?.cookies.platform && !ctx.req?.cookies.nfiversion) {
        const { platform } = ctx.req?.cookies;
        await ctx.store.dispatch(marketplaceActions.getConfig(false, platform));
      } else if (!ctx.req?.cookies.platform && ctx.req?.cookies.nfiversion) {
        const { nfiversion } = ctx.req?.cookies;
        await ctx.store.dispatch(marketplaceActions.getConfig(false, 'all', nfiversion));
      } else {
        const { platform, nfiversion } = ctx.req?.cookies;
        await ctx.store.dispatch(marketplaceActions.getConfig(false, platform, nfiversion));
      }
    } else {
      await ctx.store.dispatch(marketplaceActions.getConfig());
    }
  }

  componentDidMount() {
    this.props.loadFilters();
    if (this.props.mp.isVizWeb) {
      loadScript('/volt-mx-tutorials/static/dist/js/visualizer.js');
    }
  }

  render() {
    const {
      config, isLogin, isVizWeb, isVizApp,
    } = this.props.mp;
    return (
      <KonyLayout config={config} isLogin={isLogin} url={this.props.url}>
        <MetaTags />
        <Row className="mpLandingPage">
          <MarketplaceHeader selectedParams={this.props.assets.selectedFilters} />
          <KonyFilters
            filters={this.props.assets.filters}
            viz={this.props.mp.isVizWeb}
            vizApp={this.props.mp.isVizApp}
            url={this.props.url}
          />
          <Col span={24} type="flex" className={styles.switchWrapper} xs={0} sm={0} md={24} lg={24}>
            <KonyButton
              className={styles.generalButton}
              title="Web"
              type="normal"
              color="red"
              href={isVizWeb ? '/marketplace-viz/channels/Web' : '/channels/Web'}
            />
            <KonyButton
              className={styles.generalButton}
              title="Mobile"
              href={isVizWeb ? '/marketplace-viz/channels/Mobile' : '/channels/Mobile'}
              type="normal"
              color="lightGreen"
            />
            {
              !isVizApp
                ? (
                  <KonyButton
                    className={styles.generalButton}
                    title="Banking"
                    href={isVizWeb ? '/marketplace-viz/domain/banking' : '/domain/banking'}
                    type="normal"
                    color="lightBlue"
                  />
                )
                : null
            }
            <KonyButton
              className={styles.generalButton}
              title="Field Services"
              href={isVizWeb ? '/marketplace-viz/domain/field_services' : '/domain/field_services'}
              type="normal"
              color="skyBlue"
            />
          </Col>
          {config.domains
            && config.domains.map(domain => (
              <Col span={24} key={domain.name}>
                {
                  domain.name === 'featured'
                    ? (<FeaturedList assets={domain.assets} />)
                    : isVizApp && domain.name.toLowerCase() === 'banking'
                      ? null
                      : (
                        <AssetsList
                          title={domain.name}
                          type={domain.type.toLowerCase()}
                          assets={domain.assets}
                          slug={domain.slug}
                        />
                      )
                }
              </Col>
            ))}
        </Row>
        { !isVizApp ? (<ProposeComponentWrapper />) : null }
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
)(MpLanding);
