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
    setSelectedCategory(hikesCategories[0]);
    setValues({
      ...values,
      category: hikesCategories[0].categoryName,
    });

    setCategories([...hikesCategories]);
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

  useEffect(() => {
    getHikes();

    return () => {};
  }, []);

  return (
    <div className={styles.generateContainer}>
      <div className={styles.header}>
        <img
          style={{ height: 40, width: 40 }}
          src={`${
            publicRuntimeConfig.asset
          }/static/dist/images/productlogo.svg`}
          alt="logo"
        />
        <div>
          <p>Publish Hike</p>
        </div>
      </div>
      <div className={styles.generate}>
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
              <div className={styles.generateForm}>
                <form onSubmit={onGenerate}>
                  <div>
                    <label>Upload Tour File</label>
                    <input
                      name="file"
                      onChange={handleTourZipFile}
                      type="file"
                    />
                  </div>
                  <div>
                    <label>Generated Checksum</label>
                    <p>{values.checksum}</p>
                  </div>
                  <div>
                    <label>Platform Version</label>
                    <select
                      value={values.platformVersion}
                      onChange={handleInputChange}
                      name="platformVersion"
                    >
                      <option value={9.2}>Iris 9.2</option>
                      <option value={9.2}>Iris 9.1</option>
                      <option value={9.2}>Iris 9.0</option>
                      <option value={9.2}>Foundry 9.1</option>
                    </select>
                  </div>
                  <div>
                    <label>KUID</label>
                    <input
                      value={values.kuid}
                      onChange={handleInputChange}
                      name="kuid"
                      placeholder="KUID"
                    />
                  </div>
                  <div>
                    <label>Link</label>
                    <input
                      value={values.tourLink}
                      onChange={handleInputChange}
                      name="tourLink"
                      placeholder="new-tour-link-1"
                    />
                  </div>
                  <div>
                    <label>Tour URL</label>
                    <span>
                      https://opensource.hcltechsw.com/volt-mx-tutorials/hikes/tour/
                      <span style={{ fontWeight: "bolder" }}>
                        {values.tourLink}
                      </span>
                    </span>
                  </div>
                  <div>
                    <label>Language</label>
                    <select
                      value={values.language}
                      onChange={handleInputChange}
                      name="language"
                    >
                      <option value="en">English</option>
                      <option value="esp">Spanish</option>
                      <option value="nl">Dutch</option>
                      <option value="cn">Chinese</option>
                    </select>
                  </div>
                  <div>
                    <label>Category</label>
                    <select
                      value={values.category}
                      onChange={handleInputChange}
                      name="category"
                    >
                      {categories.map((category) => (
                        <option value={category.categoryName}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <hr />
                  <div>
                    <label>Title</label>
                    <input
                      value={values.title}
                      onChange={handleInputChange}
                      name="title"
                      placeholder="Add Title"
                    />
                  </div>
                  <div>
                    <label>Description</label>
                    <textarea
                      rows={7}
                      value={values.description}
                      onChange={handleInputChange}
                      name="description"
                      placeholder="Add Description"
                    />
                  </div>
                  <div>
                    <label>Details</label>
                    <button
                      type="button"
                      onClick={() => {
                        setView("tour");
                        setIsCKEditorVisible(true);
                      }}
                    >
                      Open Editor
                    </button>
                  </div>
                  <div>
                    <label>Steps</label>
                    <input
                      min={0}
                      type="number"
                      value={values.cards}
                      onChange={handleInputChange}
                      name="cards"
                      placeholder="How many steps"
                    />
                  </div>
                  <div>
                    <label>Time</label>
                    <input
                      min={0}
                      type="number"
                      value={values.time}
                      onChange={handleInputChange}
                      name="time"
                      placeholder="How much time"
                    />
                  </div>
                  <button type="submit">Generate</button>
                </form>
              </div>
            )}

        <div className={styles.preview}>
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
            <>
              {/* <h3>{JSON.stringify(values)}</h3> */}
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
            </>
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
        </div>
      </div>
    </div>
  );
};

export default GenerateTourPage;
