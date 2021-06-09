import React, { useEffect, useState } from "react";
import styles from "./style.scss";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { getHikesCategories } from "../src/utils/populate";
import axios from "axios";
import TourCard from "../src/components/TourCard";
import ToursList from "../src/components/ToursList";
import TourDetailPage from "./tour";
import DetailsEditor from "../src/components/DetailsEditor";
import { Row, Col } from "antd";
import { Form, Input, Button, Radio, Select } from "antd";
import UploadZip from "../src/components/HikeComposer/UploadZip";
import FormSwitcher from "../src/components/HikeComposer/FormSwitcher";
import ExportModal from "../src/components/HikeComposer/ExportModal";

const { TextArea } = Input;
const { Option } = Select;

const BASE_API = "http://localhost:3200/api";

const GenerateTourPage = () => {
  const [values, setValues] = useState({
    hikeVersion: "1.0",
    title: "",
    description: "",
    checksum: "",
    kuid: "",
    category: [],
    details: "",
    cards: 1,
    tourLink: "",
    time: 1,
    platformVersion: 9.2,
    language: "en",
  });

  const [isCKEditorVisible, setIsCKEditorVisible] = useState(false);
  const [view, setView] = useState("card");

  const [selectedFile, setSelectedFile] = useState({});
  const [tempZipFilePath, setTempZipFilePath] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [previewMode, setPreviewMode] = useState("split");

  const [categories, setCategories] = useState([]);

  const onChangeCategory = (categoryName) => {
    const selected = categories.filter(
      (category) => categoryName === category.categoryName
    );
    setSelectedCategory(selected[0]);
  };

  const getHikes = async () => {
    const { hikesData } = publicRuntimeConfig;
    const hikesCategories = await getHikesCategories(hikesData);
    setSelectedCategory(hikesCategories.data[0]);
    setValues({
      ...values,
      category: hikesCategories.data[0].categoryName,
    });

    setCategories([...hikesCategories.data]);
  };

  const changePreview = (view) => {
    setView(view);
    if (view === "list") {
      setPreviewMode("split");
    }

    if (view === "tour") {
      setPreviewMode("split");
    }
  };

  const handleTourZipFile = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    const data = new FormData();
    data.append("file", file);

    const res = await axios.post(`${BASE_API}/checksum/generate`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { checksum, tempFilePath, kuid } = res.data;

    setTempZipFilePath(tempFilePath);
    setValues({
      ...values,
      ["checksum"]: checksum,
      ["kuid"]: kuid,
    });
  };

  const setDetails = (ckData) => {
    setValues({
      ...values,
      details: ckData,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      onChangeCategory(value);
    }

    setValues({
      ...values,
      [name]: value,
    });
  };

  const onGenerate = async (e) => {
    e.preventDefault();
    const isEmptyFile =
      Object.keys(selectedFile).length === 0 &&
      selectedFile.constructor === Object;

    if (!isEmptyFile) {
      const data = {
        ...values,
        tempZipFilePath,
        filename: selectedFile.name,
        categoryInfo: selectedCategory,
      };

      const json = await axios.post(`${BASE_API}/tour/output`, data);

      console.log(json.data);
      alert("Hike generated successfully. check temp directory");
    } else {
      alert("Missing tour zip file");
    }
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    getHikes();

    return () => {};
  }, []);

  return (
    <>
      <div className={styles.header}>
        <img
          style={{ height: 40, width: 40 }}
          src={`${
            publicRuntimeConfig.asset
          }/static/dist/images/productlogo.svg`}
          alt="logo"
        />
        <div>
          <p>Volt MX Tutorials</p>
        </div>
      </div>
      <Row>
        <Col className={styles.pageContent} span={6}>
          {isCKEditorVisible
            ? previewMode === "split" && (
                <div className={styles.ckEditorContainer}>
                  <button
                    onClick={() => setIsCKEditorVisible(false)}
                    type="button"
                  >
                    Close
                  </button>
                  <DetailsEditor
                    ckData={values.details}
                    onChangeData={(data) => {
                      setDetails(data);
                    }}
                  />
                </div>
              )
            : previewMode === "split" && (
                <div className={styles.forms}>
                  <FormSwitcher />
                  <Form layout="vertical">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 10,
                      }}
                    >
                      <UploadZip />
                    </div>
                    <Form.Item label="Checksum">
                      <Input placeholder="input placeholder" />
                    </Form.Item>
                    <Form.Item label="KUID">
                      <Input placeholder="input placeholder" />
                    </Form.Item>
                    <Form.Item label="Tour URL">
                      <Input placeholder="input placeholder" />
                    </Form.Item>
                    <Form.Item label="Category">
                      <Select
                        defaultValue="Build Your First Mobile App"
                        style={{}}
                        onChange={handleChange}
                      >
                        <Option value="Build Your First Mobile App">
                          Build Your First Mobile App
                        </Option>
                        <Option value="Build Your First Web App">
                          Build Your First Web App
                        </Option>
                        <Option value="Develop the Front End">
                          Develop the Front End
                        </Option>
                        <Option value="Manage Back-end Services">
                          Manage Back-end Services
                        </Option>
                        <Option value="Advanced Concepts">
                          Advanced Concepts
                        </Option>
                        <Option value="DBX">DBX</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Title">
                      <Input placeholder="Add Title Here..." />
                    </Form.Item>
                    <Form.Item label="Description">
                      <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="Details">
                      <Button
                        onClick={() => {
                          setView("tour");
                          setIsCKEditorVisible(true);
                        }}
                        type="primary"
                        icon="edit"
                      >
                        Open Editor
                      </Button>
                    </Form.Item>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item label="Steps">
                          <Input
                            defaultValue={1}
                            min={1}
                            type="number"
                            placeholder="How many Steps..."
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Time">
                          <Input
                            defaultValue={1}
                            min={1}
                            type="number"
                            placeholder="Input Time..."
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item>
                      <Button type="primary">Generate Hike</Button>
                    </Form.Item>
                    <ExportModal />
                    <div />
                  </Form>
                </div>
              )}
        </Col>
        <Col className={styles.preview} span={18}>
          <ul className={styles.previews}>
            {previewMode === "split" ? (
              <>
                <li onClick={() => changePreview("card")}>Card Preview</li>
                {/* <li onClick={() => changePreview("list")}>List Preview</li> */}
                <li onClick={() => changePreview("tour")}>Tour Preview</li>
              </>
            ) : (
              <li
                onClick={() => {
                  setView("tour");

                  setPreviewMode("split");
                }}
              >
                Close Full Preview
              </li>
            )}
          </ul>
          <hr />
          {view === "card" && (
            <div className={styles.cardPreview}>
              <div>
                <h3>{selectedCategory.categoryName}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedCategory.categoryDescription,
                  }}
                />
                <TourCard
                  tour={{
                    title: values.title,
                    description: values.description,
                    cards: values.cards,
                    time: `${values.time} Mins`,
                  }}
                />
              </div>
            </div>
          )}
          {/* {view === "tour" &&
            categories.map((item) =>
              item.categoryTours !== null ? (
                <ToursList
                  key={item.categoryName}
                  title={item.categoryName}
                  desc={item.categoryDescription}
                  alias={item.categoryAlias || item.categoryName}
                  tours={item.categoryTours}
                />
              ) : null
            )} */}
          {view === "tour" && (
            <>
              {previewMode === "split" ? (
                <button
                  onClick={() => {
                    setPreviewMode("full");
                  }}
                >
                  Full Preview
                </button>
              ) : (
                previewMode === "full " && (
                  <li onClick={() => setPreviewMode("split")}>
                    Close Full Preview
                  </li>
                )
              )}
              <TourDetailPage
                previewData={{
                  ...values,
                  time: `${values.time} Minutes`,
                  fileName: selectedFile.name,
                }}
                url={{ asPath: "preview" }}
              />
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default GenerateTourPage;
