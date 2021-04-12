import React,{Component} from 'react'
import PageNotFound from '../src/components/PageNotFound';
import KonyLayout from '../src/components/KonyLayout';
import { marketplaceActions, assetActions } from '../src/actions';
import initialize from '../src/utils/initialize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MarketplaceHeader from "../src/components/MarketplaceHeader";

class Error extends Component {
  static async getInitialProps(ctx) {
    ctx.store.dispatch(assetActions.setSelectedFilters({}))
    await initialize(ctx);
    await ctx.store.dispatch(marketplaceActions.getConfig(true));
  }

  render() {
    const { config, isLogin } = this.props.mp;
    return (
    <KonyLayout config={config} isLogin={isLogin} url={this.props.url}>
      <MarketplaceHeader />
      <PageNotFound />
    </KonyLayout>
    );
  }
}


function mapStateToProps({ marketplace, assets }) {
  return {
    mp: marketplace,
    assets
  };
}
const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...marketplaceActions, ...assetActions }, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Error);
