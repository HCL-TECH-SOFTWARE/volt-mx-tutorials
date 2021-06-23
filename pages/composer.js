import React, { useEffect, useState } from "react";
import styles from "./style.scss";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { getMapCategories } from "../src/utils/populate";
import axios from "axios";
import TourCard from "../src/components/TourCard";
import ToursList from "../src/components/ToursList";
import TourDetailPage from "./tour";
import DetailsEditor from "../src/components/DetailsEditor";
import { Row, Col } from "antd";
import { Form, Input, Button, Radio, Select, message } from "antd";
import FormSwitcher from "../src/components/HikeComposer/FormSwitcher";
import ExportModal from "../src/components/HikeComposer/ExportModal";
import EditHike from "../src/components/HikeComposer/EditHike";
import { useRouter } from "next/router";

const { TextArea } = Input;
const { Option } = Select;

const BASE_API = "http://localhost:3200/api";

const GenerateTourPage = () => {
  const { query } = useRouter();
  const { checksum, kuid, zipName } = query;
  const [values, setValues] = useState({
    hikeVersion: "1.0",
    title: "",
    description: "",
    checksum,
    kuid,
    category: [],
    details: "",
    cards: 1,
    tourLink: zipName,
    time: 1,
    platformVersion: 9.2,
  });

  const [isCKEditorVisible, setIsCKEditorVisible] = useState(false);
  const [view, setView] = useState("card");
  const [selectedFile, setSelectedFile] = useState({});
  const [tempZipFilePath, setTempZipFilePath] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [previewMode, setPreviewMode] = useState("split");
  const [visible, setVisible] = useState(false);
  const [exportJsonData, setexportJsonData] = useState({});

  const [categories, setCategories] = useState([]);

  //Form Switcher states
  const [current, setCurrent] = useState("new");

  const handleSwitcherClick = (e) => {
    setCurrent(e.key);
  };

  const onChangeCategory = (categoryName) => {
    const selected = categories.find(
      (category) => categoryName === category.categoryName
    );
    setSelectedCategory(selected);
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

    const data = {
      ...values,
      filename: zipName.toLowerCase(),
      categoryInfo: selectedCategory,
    };

    const json = await axios.post(`${BASE_API}/tour/output`, data);

    setexportJsonData(json.data);
    setVisible(true);
  };

  const getHikes = async () => {
    const categoriesMaps = await getMapCategories();
    setSelectedCategory(categoriesMaps[0]);
    setCategories(categoriesMaps);
  };

  useEffect(() => {
    getHikes();
    return () => {};
  }, []);

  return (
    <>
      <div className={styles.header}>
        <img
          className={styles.logo}
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
                    checksum={checksum}
                    ckData={values.details}
                    onChangeData={(data) => {
                      setDetails(data);
                    }}
                  />
                </div>
              )
            : previewMode === "split" && (
                <div className={styles.forms}>
                  <FormSwitcher
                    setView={handleSwitcherClick}
                    current={current}
                  />
                  {current === "new" && (
                    <Form layout="vertical">
                      <>
                        <Form.Item
                          className={styles.formContainer}
                          label="Checksum"
                        >
                          <TextArea
                            style={{ color: "#1890ff" }}
                            value={values.checksum}
                            rows={2}
                          />
                        </Form.Item>
                        <Form.Item
                          className={styles.formContainer}
                          label="KUID"
                        >
                          <Input
                            style={{ color: "#1890ff" }}
                            value={values.kuid}
                          />
                        </Form.Item>
                        <Form.Item
                          className={styles.formContainer}
                          label="Tour URL"
                        >
                          <Input
                            name="tourLink"
                            value={values.tourLink.toLowerCase()}
                            onChange={handleInputChange}
                            placeholder="Add URL"
                          />
                        </Form.Item>
                        <Form.Item
                          className={styles.formContainer}
                          label="Category"
                        >
                          {categories.length > 0 && (
                            <Select
                              defaultValue={categories[0].categoryName}
                              onChange={onChangeCategory}
                            >
                              {categories.map((category) => (
                                <Option value={category.categoryName}>
                                  {category.categoryName}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                        <Form.Item
                          className={styles.formContainer}
                          label="Title"
                        >
                          <Input
                            name="title"
                            value={values.title}
                            onChange={handleInputChange}
                            placeholder="Add Title..."
                          />
                        </Form.Item>
                        <Form.Item
                          className={styles.formContainer}
                          label="Description"
                        >
                          <TextArea
                            name="description"
                            value={values.description}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Add Description..."
                          />
                        </Form.Item>
                        <Form.Item
                          className={styles.formContainer}
                          label="Details"
                        >
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
                            <Form.Item
                              className={styles.formContainer}
                              label="Steps"
                            >
                              <Input
                                min={1}
                                type="number"
                                name="cards"
                                value={values.cards}
                                onChange={handleInputChange}
                                placeholder="How many Steps..."
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              className={styles.formContainer}
                              label="Time"
                            >
                              <Input
                                min={1}
                                type="number"
                                name="time"
                                value={values.time}
                                onChange={handleInputChange}
                                placeholder="Input Time..."
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Button type="primary" onClick={onGenerate}>
                          Generate Hike
                        </Button>
                        <ExportModal
                          branchName={values.tourLink}
                          jsonData={exportJsonData}
                          category={selectedCategory.categoryAlias}
                          visible={visible}
                          onClose={() => setVisible(false)}
                        />
                      </>
                      <div />
                    </Form>
                  )}
                  {current === "edit" && <EditHike />}
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
              <div className={styles.previewContainer}>
                {categories.length > 0 && (
                  <>
                    <h3>{selectedCategory.categoryName}</h3>
                    <div
                      style={{ textAlign: "center", width: "50%" }}
                      dangerouslySetInnerHTML={{
                        __html: selectedCategory.categoryDescription,
                      }}
                    />
                  </>
                )}
                <TourCard
                  isComposer={true}
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
