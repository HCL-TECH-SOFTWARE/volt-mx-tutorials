import React, { Component } from 'react';
import Modal from 'antd/lib/modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './style.scss';
import KonyButton from '../KonyButton';
import VizButton from './VizButton';
import ComingSoon from './comingSoon';
import ContactUs from './contactUs';
import CoreAsset from './CoreAsset';
import SuccessModal from '../SuccessModal';
import KonyLoader from '../KonyLoader';
import { instance as axios } from '../../utils/initialize';
import { validateData } from '../../utils';

class AssetDownloadButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalError: false,
      modalMessage: "Thanks for reaching out!",
      modalLoading: false,
      isNotified: this.props.isNotified,
      isViz: this.props.marketplace.isVizWeb,
      isVizApp: this.props.marketplace.isVizApp,
      oauthURL: `/oauth/login?destination=${this.props.url.asPath || '/'}`,
      validDownloadURLPresent: validateData(this.props.fileURL),
    };
  }

  handleClose = () => {
    this.setState({
      showModal: false,
    });
  };

  success = (message) => {
    this.setState({
      modalLoading: false,
      showModal: true,
      modalError: false,
      modalMessage: message || "Thanks for reaching out!",
      isNotified: true,
    });
  };

  error = (message) => {
    this.setState({
      modalLoading: false,
      showModal: true,
      modalError: true,
      modalMessage: message || "Something went wrong. Please try again later.",
      visible: true,
    });
  };

  getDownloadButtonURL = () => {
    if (this.props.marketplace.isLogin) {
      return `${this.props.fileURL}?agent=web`;
    }
    return this.state.oauthURL;
  }

  handleClick = (type) => {
    if (!this.props.marketplace.isLogin && !this.state.isViz) {
      return null;
    }
    if (type === "contact" || type === "notify") {
      this.handleContactSubmit(type);
    }
    if (type === "download") {
      setTimeout(function () {
        window.dataLayer.push({
          'assetTitle': this.props.title,
          'event': 'webDownload'
        })
      }.bind(this), 1000);
    }
  }

  handleContactSubmit = async (type) => {
    this.setState({
      modalLoading: true,
    });
    const data = new FormData();
    data.append('title', this.props.title);
    data.append('version', this.props.Version);
    data.append('assetID', this.props.itemId);
    data.append('notify', type === 'notify');

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    axios({
      method: 'post',
      url: 'api/v1_0/marketplace/post/contact',
      data,
      config: {
        headers,
      },
    })
      .then(res => {
        this.success(res.data.message);
      })
      .catch(error => this.error());
  }
  renderButton() {
    const { isViz, isVizApp, validDownloadURLPresent, isNotified, oauthURL } = this.state;
    const { isLogin } = this.props.marketplace;

    if (!validDownloadURLPresent) {
      if (this.props.termMapName === "coming_soon") {
        return <ComingSoon hideNotify={isVizApp} disabled={isNotified} href={oauthURL} isLogin={isLogin || isViz} submit={() => this.handleClick("notify")} />;
      }
      if (this.props.isCoreAsset) {
        return <CoreAsset isLogin={isLogin || isViz} />;
      }
      if (!isVizApp) {
        return <ContactUs href={oauthURL} disabled={isNotified} isLogin={isLogin || isViz} submit={() => this.handleClick("contact")} />;
      }
      return null;
    };

    if (this.props.isCoreAsset) {
      return <CoreAsset isLogin={isLogin || isViz} />;
    }

    if (this.props.isContactUs && !isVizApp) {
      return <ContactUs href={oauthURL} disabled={isNotified} isLogin={isLogin || isViz} submit={() => this.handleClick("contact")} />;
    }

    if (this.props.isMobile) {
      return null;
    }

    if (this.props.termMapName === "coming_soon") {
      return <ComingSoon hideNotify={isVizApp} disabled={isNotified} href={oauthURL} isLogin={isLogin || isViz} submit={() => this.handleClick("notify")} />;
    }

    if (isViz) {
      return (<VizButton {...this.props} disabled={!validDownloadURLPresent} />);
    }
    return (
      <KonyButton
        title={isLogin ? "Download" : "Login to Download"}
        type="download"
        color="blue"
        className={`${style.assetButtons} ${isLogin ? style.pushLeft : null}`}
        href={this.getDownloadButtonURL()}
        disabled={!validDownloadURLPresent}
        onClick={() => this.handleClick("download")}
      />
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderButton()}
        {this.state.modalLoading ? (<KonyLoader style={{ opacity: '0.6' }} />) : null}
        <Modal
          centered
          visible={this.state.showModal}
          onCancel={e => this.handleClose(e)}
          onOk={e => this.handleClose(e)}
          closable={false}
          footer={null}
          className={style.successModal}
        >
          <SuccessModal
            error={this.state.modalError}
            handleClick={e => this.handleClose(e)}
            message={this.state.modalMessage}
          />
        </Modal>
      </React.Fragment>
    );
  }
}
AssetDownloadButton.propTypes = {
  fileURL: PropTypes.string,
};

AssetDownloadButton.defaultProps = {
  fileURL: '',
};

const mapStateToProps = ({ marketplace }) => ({ marketplace });

export default connect(mapStateToProps)(AssetDownloadButton);
