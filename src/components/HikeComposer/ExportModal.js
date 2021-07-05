import React, { useState } from "react";
import { Modal, Button } from "antd";
import styles from "./styles.scss";
import ExportTabSwitcher from "./ExportTabSwitcher";
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "axios";
import { BASE_BRANCH } from "../../config";

const BASE_API = "http://localhost:3200/api";

const ExportModal = ({ visible, jsonData, onClose, branchName, category }) => {
  const [view, setView] = useState("json");
  const [pushed, setPushed] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [forkUrl, setForkUrl] = useState("");

  const onSubmitToFork = async () => {
    if (!pushed && !pushing) {
      setPushing(true);
      axios
        .post(`${BASE_API}/export/push`, { ...jsonData, branchName, category })
        .then((res) => {
          const { success, remoteName } = res.data;
          if (success) {
            setForkUrl(remoteName);
            setPushed(true);
            setPushing(false);
          }
        });
    }

    if (pushed) {
      onClose();
      setPushed(false);
    }
  };

  const visitFork = () => {
    window.open(
      `https://github.com/HCL-TECH-SOFTWARE/volt-mx-tutorials/compare/${BASE_BRANCH}...mikeangelsilva:${branchName}?expand=1`,
      "_blank"
    );
  };

  return (
    <div>
      <Modal
        className={styles.exportModal}
        title={
          pushed
            ? "Pushed Successfully"
            : pushing
            ? "Please wait"
            : "Compose Successfully"
        }
        centered
        visible={visible}
        onOk={onSubmitToFork}
        onCancel={onClose}
        okText={
          pushed ? "Done" : pushing ? "Please wait" : "Push to Fork Repository"
        }
      >
        {!pushed && !pushing && (
          <ExportTabSwitcher
            key="json"
            changeTab={(key) => {
              setView(key);
            }}
          />
        )}
        {pushing && (
          <div className={styles.statusContainer}>
            <p>Pushing to your Fork Repository</p>
          </div>
        )}
        {view === "json" &&
          (pushed ? (
            <div className={styles.statusContainer}>
              <p style={{ fontSize: 24 }}>Successful!</p>
              <p>
                You can now create a{" "}
                <span style={{ fontWeight: "bold" }}>Pull Request</span>
              </p>
              <label>
                Fork URL: <span style={{ fontWeight: "bold" }}>{forkUrl}</span>
              </label>
              {/* <Button onClick={visitFork}>View Pull Request</Button> */}
            </div>
          ) : (
            !pushing && (
              <div className={styles.jsonContainer}>
                <CopyToClipboard text={jsonData}>
                  <button className={styles.copyToClipboard}>
                    Copy to clipboard
                  </button>
                </CopyToClipboard>

                <pre className={styles.jsonValues}>
                  {JSON.stringify(jsonData, null, 2)}
                </pre>
              </div>
            )
          ))}
      </Modal>
    </div>
  );
};

export default ExportModal;
