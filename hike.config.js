const path = require("path");
const fs = require("fs");

const HIKES_BASE_URL = 'volt-mx-tutorials';
const HIKES_CONTENT_PATH = './public/contents';

// get all hikes categories directory names
const getHikeDirectories = () =>
fs.readdirSync(HIKES_CONTENT_PATH, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)

// initialize landing page (home and list of hikes)
const tours = {
    "/": { page: '/' },
    "/hikes": { page: '/hikes'}
};

// export and append all tours into static html page
getHikeDirectories().forEach(categoryTitle => {
    const file = fs.readFileSync(path.resolve(__dirname, `${HIKES_CONTENT_PATH}/${categoryTitle}/tours.json`), 'utf-8');
    const categoryTours = JSON.parse(file).categoryTours;
    categoryTours.forEach(t => {
    tours[`/${t.alias}`] = { page: "/tour" }
    })
})

module.exports = {
    HIKES_BASE_URL,
    tours,
    getHikeDirectories
}
