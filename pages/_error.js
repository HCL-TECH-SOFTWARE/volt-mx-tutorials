import React,{Component} from 'react'
import PageNotFound from '../src/components/PageNotFound';
import KonyLayout from '../src/components/KonyLayout';
import { marketplaceActions, assetActions } from '../src/actions';
import initialize from '../src/utils/initialize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MarketplaceHeader from "../src/components/MarketplaceHeader";
import HikeHeader from '../src/components/HikeHeader';

class Error extends Component {

  render() {
    return (
      <>
      <HikeHeader />
      <PageNotFound />
      </>
    );
  }
}

export default Error;
