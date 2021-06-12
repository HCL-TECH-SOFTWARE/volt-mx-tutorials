import React, { useState } from "react";
import { Modal, Button } from "antd";
import styles from "./styles.scss";
import ExportTabSwitcher from "./ExportTabSwitcher";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ExportModal = ({ visible, jsonData, onClose }) => {
  const [view, setView] = useState("info");
  // state = {
  //   exportModalVisible: false,
  //   view: "info",
  //   jsonValue: JSON.stringify(
  //     {
  //       nid: 24405,
  //       title: "Creating Services for the Back-end Data",
  //       created: 1585626222,
  //       updated: 1586774995,
  //       fileURL:
  //         "https://opensource.hcltechsw.com/volt-mx-tutorials/hikes/tour/24405/download/17120",
  //       fileSize: "20.45 KB",
  //       fileName: "createservices_v9.zip",
  //       fid: 17120,
  //       checksum:
  //         "6f8aa79860b05291d1ea97ec9c62f14d2387590b9142d1d6f910520fab4c0a22",
  //       url:
  //         "https://opensource.hcltechsw.com/volt-mx-tutorials/hikes/tour/creating-services-back-end-data",
  //       alias: "hikes/tour/creating-services-back-end-data",
  //       description: "Create services for the back-end data",
  //       details:
  //         "<p><!--StartFragment--></p> <div> <div> <p>This learning module is a Volt MX HIKE.  A HIKE is an interactive tour inside Volt MX Iris that guides you through step-by-step process of each module. You can access the HIKES catalog by clicking the Hike icon in the Iris toolbar:&nbsp;</p> <p> &nbsp;</p> <p>Learn how to:&nbsp;</p> <ul> <li>Create and configure Storage Object Services&nbsp;<strong>Accounts</strong>&nbsp;and&nbsp;<strong>Recipients</strong>.</li> <li>Publish the Project Services to a run-time server.</li> </ul> </div> </div> <p><!--EndFragment--></p>",
  //       cards: 11,
  //       time: "10 Mins",
  //       platformVersion: "Iris 9.0",
  //       category: [],
  //       image: "/default/hike-default.png",
  //       kuid: "a7a762t5-3eac-44r5-8bu2-89b781n1",
  //       hikeVersion: "1.0",
  //       weight: "4",
  //     },
  //     undefined,
  //     2
  //   ),
  // };

  return (
    <div>
      <Modal
        className={styles.exportModal}
        title="Compose Successfully"
        centered
        visible={visible}
        onOk={onClose}
        onCancel={onClose}
      >
        <ExportTabSwitcher
          changeTab={(key) => {
            setView(key);
          }}
        />
        {view === "info" && (
          <div className={styles.steps}>
            <h3>Steps to add it in Hikes Catalog</h3>
            <div>
              <h4>1. Representativeness:</h4>
              <p>
                When sampling method is adopted by the researcher, the basic
                assumption is that the samples so selected out of the population
                are the best representative of the population under study. Thus
                good samples are those who accurately represent the population.
                Probability sampling technique yield representative samples. On
                measurement terms, the sample must be valid. The validity of a
                sample depends upon its accuracy.
              </p>
            </div>
            <div>
              <h4>1. Representativeness:</h4>
              <p>
                When sampling method is adopted by the researcher, the basic
                assumption is that the samples so selected out of the population
                are the best representative of the population under study. Thus
                good samples are those who accurately represent the population.
                Probability sampling technique yield representative samples. On
                measurement terms, the sample must be valid. The validity of a
                sample depends upon its accuracy.
              </p>
            </div>
            <div>
              <h4>1. Representativeness:</h4>
              <p>
                When sampling method is adopted by the researcher, the basic
                assumption is that the samples so selected out of the population
                are the best representative of the population under study. Thus
                good samples are those who accurately represent the population.
                Probability sampling technique yield representative samples. On
                measurement terms, the sample must be valid. The validity of a
                sample depends upon its accuracy.
              </p>
            </div>
            <div>
              <h4>1. Representativeness:</h4>
              <p>
                When sampling method is adopted by the researcher, the basic
                assumption is that the samples so selected out of the population
                are the best representative of the population under study. Thus
                good samples are those who accurately represent the population.
                Probability sampling technique yield representative samples. On
                measurement terms, the sample must be valid. The validity of a
                sample depends upon its accuracy.
              </p>
            </div>
          </div>
        )}
        {view === "json" && (
          <div className={styles.jsonContainer}>
            <CopyToClipboard
              text={jsonData}
              // onCopy={() => this.setState({ copied: true })}
            >
              <button className={styles.copyToClipboard}>
                Copy to clipboard
              </button>
            </CopyToClipboard>

            <pre className={styles.jsonValues}>
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExportModal;
