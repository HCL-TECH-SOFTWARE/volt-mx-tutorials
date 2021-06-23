const path = require("path");
const fs = require("fs");

const HIKES_BASE_URL = "volt-mx-tutorials";
const HIKES_CONTENT_PATH = "./public/contents";
const BASE_BRANCH = "phx-dev";

// get all hikes categories directory names
const getHikeDirectories = () =>
  fs
    .readdirSync(HIKES_CONTENT_PATH, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

// get all hikes categories directory names
const getHikeTours = () =>
  fs
    .readdirSync(HIKES_CONTENT_PATH, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

// initialize landing page (home and list of hikes)
const tours = {
  "/": { page: "/" },
  "/hikes": { page: "/hikes" },
  "/hikes/search": { page: "/hikelisting" },
};

// export and append all tours into static html page
getHikeDirectories().forEach((categoryTitle) => {
  const file = fs.readFileSync(
    path.resolve(
      __dirname,
      `${HIKES_CONTENT_PATH}/${categoryTitle}/tours.json`
    ),
    "utf-8"
  );
  const categoryTours = JSON.parse(file).categoryTours;
  categoryTours.forEach((t) => {
    tours[`/${t.alias}`] = { page: "/tour" };
  });
});

const checkTempDirExist = () => {
  return fs.existsSync("./temp");
};
const checkUploadDirExist = () => {
  return fs.existsSync("./uploads");
};

const createTempDir = () => {
  if (!checkTempDirExist) {
    fs.mkdirSync("./temp");
  }
};

const createUploadDirExist = () => {
  if (!checkUploadDirExist) {
    fs.mkdirSync("./uploads");
  }
};

module.exports = {
  HIKES_BASE_URL,
  HIKES_CONTENT_PATH,
  tours,
  getHikeDirectories,
  checkTempDirExist,
  checkUploadDirExist,
  createTempDir,
  createUploadDirExist,
  getHikeTours,
  BASE_BRANCH,
};
