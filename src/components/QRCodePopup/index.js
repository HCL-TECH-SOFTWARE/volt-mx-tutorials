import React, { Component, Fragment } from 'react';
import Modal from 'antd/lib/modal';
import style from './style.scss';
import QRCode from 'qrcode.react';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

class QRCodePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  };

  showModal = (e) => {
    this.setState({
      visible: true,
    });
  };

  onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  redirectToAppStore = () => {
    location.href = 'https://apps.apple.com/us/developer/hcl-america-inc/id392909135';
  };

  redirectToGooglePlay = () => {
    location.href = 'https://play.google.com/store/apps/developer?id=HCL+Software';
  };

  render() {
    return (
      <Fragment>
        <h3>Live preview the asset using&nbsp; 
          <a onClick={e => this.showModal(e)}>
            App Viewer
          </a>
        </h3>
        <Modal
          onCancel={this.onCancel}
          visible = {this.state.visible}
          footer={null}
        >
          <div className = {style.common}>
            <p className = {style.heading}>
              Download Kony Visualizer App Viewer
            </p>
            <p className = {style.appViewerDescription}>
              Kony Visualizer App Viewer is the companion app of Kony Visualizer. This app lets users Save Time, Share Previews and Multi-device Testing. Download the Kony App Viewer and get started.
            </p>
            <p className = {style.scanQrCode}>
              Scan QR Code
            </p>
            <p className = {style.qrCodeDescription}>
              Scan QR code using your mobile phone to download Kony Visualizer App Viewer or you can download from App Store and Google Play.
            </p>
            <QRCode className = {style.qrCode}
              value={`https://www.kony.com/marketplace/app_preview?apptolaunch=${this.props.prototype}`}
              size={130}
            />
          </div>
          <div className = {style.actionWrapper}>
            <div className = {style.borderBox} onClick = {this.redirectToAppStore}>
              <div className = {style.alignment}>
                <img
                  src={`${publicRuntimeConfig.asset}/static/dist/images/iconApple.svg`}
                  className = {style.imgAlignment}
                >
                </img>
                <div className = {style.textWrapper}>
                  <p className = {style.textAvailable}>
                    Available on the
                  </p>
                  <p className = {style.textPlayStore}>
                    Apple Store
                  </p>
                </div>
              </div>
            </div>
            <div className = {style.borderBox} onClick = {this.redirectToGooglePlay}>
              <div className = {style.alignment}>
                <img
                  src={`${publicRuntimeConfig.asset}/static/dist/images/iconGooglePlay.svg`}
                  className = {style.imgAlignment}
                >
                </img>
                <div className = {style.textWrapper}>
                  <p className = {style.textAvailable}>
                    Available on the
                  </p>
                  <p className = {style.textPlayStore}>
                    Google Play
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    )
  }
}

export default QRCodePopup;
