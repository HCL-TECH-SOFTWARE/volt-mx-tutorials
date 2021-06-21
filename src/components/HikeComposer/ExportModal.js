import React, { useState } from "react";
import { Modal, Button } from "antd";
import styles from "./styles.scss";
import ExportTabSwitcher from "./ExportTabSwitcher";
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "axios";

const BASE_API = "http://localhost:3200/api";

const ExportModal = ({ visible, jsonData, onClose, branchName }) => {
  const [view, setView] = useState("json");
  const [pushed, setPushed] = useState(false);

  const onSubmitToFork = () => {
    axios
      .post(`${BASE_API}/export/push`, { ...jsonData, branchName })
      .then((res) => {
        if (res.data.success) {
          setPushed(true);
        }
      });
  };

  const visitFork = () => {
    window.open(
      `https://github.com/HCL-TECH-SOFTWARE/volt-mx-tutorials/compare/phx-dev...mikeangelsilva:${branchName}?expand=1`,
      "_blank"
    );
  };

  return (
    <div>
      <Modal
        className={styles.exportModal}
        title="Compose Successfully"
        centered
        visible={visible}
        onOk={onSubmitToFork}
        onCancel={onClose}
        okText="Push to Pork Repository"
      >
        <ExportTabSwitcher
          key="json"
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
        {view === "json" &&
          (pushed ? (
            <>
              <p>You can now create a Pull Request</p>
              <Button onClick={visitFork}>Visit Fork</Button>
            </>
          ) : (
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
          ))}
      </Modal>
    </div>
  );
};

export default ExportModal;
