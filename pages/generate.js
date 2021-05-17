import React, { useEffect, useState } from "react";
import styles from "./style.scss";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { getHikesCategories } from "../src/utils/populate";
import axios from "axios";
import TourCard from "../src/components/TourCard";
import ToursList from "../src/components/ToursList";
import TourDetailPage from "./tour";

const BASE_API = "http://localhost:3200/api";

const GenerateTourPage = () => {
  const [values, setValues] = useState({
    title: "",
    description: "",
    checksum: "",
    kuid: "953f7at8-eba4-40rd-86uc-bf1f0dnd",
    category: [],
    details: "",
    cards: 0,
    time: 0,
    platformVersion: 9.2,
    language: "en",
  });

  const [view, setView] = useState("card");

  const [selectedFile, setSelectedFile] = useState({});
  const [tempZipFilePath, setTempZipFilePath] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({});

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
      category: selectedCategory.categoryName,
    });

    setCategories([...hikesCategories]);
  };

  const changePreview = (view) => {
    setView(view);
    if (view === "list") {
      const cats = [...categories];
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

    const { checksum, tempFilePath } = res.data;

    setTempZipFilePath(tempFilePath);
    setValues({
      ...values,
      ["checksum"]: checksum,
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
      };

      const json = await axios.post(`${BASE_API}/tour/output`, data);

      console.log(json.data);
    } else {
      alert("Missing tour zip file");
    }
  };

  useEffect(() => {
    getHikes();

    return () => {};
  }, []);

  return (
    <div className={styles.pageContainer}>
      <h1>Add Hike/Tour</h1>
      <div className={styles.generate}>
        <div className={styles.generateForm}>
          <form onSubmit={onGenerate}>
            <div>
              <label>Upload Tour File</label>
              <input name="file" onChange={handleTourZipFile} type="file" />
            </div>
            <div>
              <label>Generated Checksum</label>
              <p>{values.checksum}</p>
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
            <div>
              <label>Platform Version</label>
              <input
                value={values.platformVersion}
                onChange={handleInputChange}
                name="description"
                label="Description"
              />
            </div>
            <button type="submit">Generate</button>
          </form>
        </div>
        <div className={styles.preview}>
          <ul className={styles.previews}>
            <li onClick={() => changePreview("card")}>Card Preview</li>
            <li onClick={() => changePreview("list")}>List Preview</li>
            <li onClick={() => changePreview("inside")}>Inside Preview</li>
          </ul>
          <hr />
          {view === "card" && (
            <>
              {/* <h3>{JSON.stringify(selectedCategory)}</h3> */}
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
                  time: `${values.time} Minutes`,
                }}
              />
            </>
          )}
          {view === "list" &&
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
            )}
          {view === "inside" && (
            <TourDetailPage
              url={{ asPath: "/hikes/tour/add-create-recipient" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateTourPage;
