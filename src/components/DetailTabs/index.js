import React, { Component } from 'react';
import Tabs from 'antd/lib/tabs';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import PropTypes from 'prop-types';
import style from './style.scss';
import DetailsTabContent from '../DetailsTabContent';
import Documentation from '../Documentation';
import KonySupport from '../KonySupport';
import KonyLike from '../KonyLike';
import AssetDownloadButton from '../AssetDownloadButton';
import { connect } from 'react-redux';

const { TabPane } = Tabs;
const isDocLinkValid = src => src.length !== 0 && src !== '' && src !== null;

class DetailTabs extends Component {
  setKey = (key) => {
    const tempStore = JSON.parse(localStorage.getItem('selectedKeys')) || {};
    tempStore[this.props.ID] = key;
    localStorage.setItem('selectedKeys', JSON.stringify(tempStore));
  };

  renderHowToTab() {
    if (isDocLinkValid(this.props.DocumentationURL)) {
      return (
        <TabPane tab="How to" key="2"><Documentation isInIframe={this.props.Iframe} src={this.props.DocumentationURL} /></TabPane>
      );
    }
    return null;
  }

  render() {
    const {platformVersion, isVizWeb, termMapName} = this.props;
    return (
      <Tabs
        tabPosition="top"
        animated={false}
        defaultActiveKey="1"
        className={`${style.tabWrapper} detailPageTabWrapper`}
        onChange={this.setKey}
        tabBarExtraContent={(
          <Row className="nocontent">
            <Col md={0} lg={24} sm={0} xs={0}>
              <AssetDownloadButton
                {...this.props}
                title={this.props.title}
                url={this.props.url}
              />
            </Col>
            <KonyLike id={this.props.itemId} isLiked={this.props.isLiked} />
          </Row>
        )}
      >
        <TabPane tab="Details" key="1"><DetailsTabContent {...this.props} /></TabPane>
        {this.renderHowToTab()}
        <TabPane tab="Support" key="3"><KonySupport title={this.props.title} url={this.props.url} /></TabPane>
      </Tabs>
    );
  }
}

DetailTabs.propTypes = {
  asset: PropTypes.object,
  DocumentationURL: PropTypes.string,
};

DetailTabs.defaultProps = {
  asset: {},
  DocumentationURL: '',
};
export default DetailTabs;
