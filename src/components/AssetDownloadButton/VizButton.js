import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'antd/lib/select';
import style from './style.scss';
import KonyButton from '../KonyButton';

const { Option } = Select;
class VizButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonText: 'Download',
      disable: true,
      url: '#',
      selectedValue: '',
    };
  }

  onClick(e) {
    window.dataLayer.push({
      'assetTitle': this.props.title,
      'event': 'vizDownload'
    })
    if (this.state.selectedValue === 'collectionLibrary') {
      this.sendPostMessage(e);
    }
  }

  // Fetch postMessage on asset import.
  getPostMessage() {
    const date = new Date();
    let msgRequest =  {
      context: 'import',
      target: this.props.termMapName == 'app' ? 'workspace' : 'library',
      category: this.props.termMapName,
      item_title: this.props.title,
      checksum: this.props.checkSum,
      download_url: `${this.props.fileURL}?agent=viz`,
      filename: this.props.fileName,
      item_details: this.props.item_details,
      has_hike : (this.props.tourDetails) ? true : false,
    }

    if (this.props.tourDetails) {
      msgRequest.hike = this.props.tourDetails;
    }

    return {
      namespace: 'marketplace',
      msg_id: `id_${date.getTime()}`,
      msg_type: 'POST',
      request: msgRequest,
    };
  }

  sendPostMessage(e) {
    e.preventDefault();
    e.message = this.getPostMessage();
    if (typeof e.message !== 'undefined') {
      parent.postMessage(e.message, '*');
    }
    return false;
  }

  checkDisabledButton() {
    if (this.props.disabled) {
      return (
        <KonyButton
          title="Coming Soon"
          type="action"
          color="blue"
          className={`${style.assetButtons} ${style.pushLeft}`}
          disabled
        />);
    }
    return this.renderButton(this.props.Category);
  }

  renderButton() {
    if (this.props.termMapName === 'app') {
      return (
        <KonyButton
          title="Import To Workspace"
          type="action"
          color="blue"
          className={`${style.assetButtons} ${style.pushLeft}`}
          onClick={e => this.sendPostMessage(e)}
        />);
    }

    return (
      <KonyButton
        title="Import To Collection Library"
        type="action"
        color="blue"
        className={`${style.assetButtons} ${style.pushLeft}`}
        onClick={e => this.sendPostMessage(e)}
      />
    );
  }

  render() {
    return this.checkDisabledButton();
  }
}

VizButton.propTypes = {
  url: PropTypes.string,
  Category: PropTypes.string,
};

VizButton.defaultProps = {
  url: '',
  Category: '',
};

export default VizButton;
