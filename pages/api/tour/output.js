import { BASE_BRANCH } from "../../../src/config";

const fs = require("fs");

const TEMP_FOLDER = "./temp";
const EXPORT_FOLDER = "./export";

const autoSerialize = (forms) => {
  const { category, filename, tourLink, time, categoryInfo } = forms;

  return {
    ...forms,
    url: `https://opensource.hcltechsw.com/volt-mx-tutorials/hikes/tour/${tourLink}`,
    fileURL: `https://raw.githubusercontent.com/HCL-TECH-SOFTWARE/volt-mx-tutorials/${BASE_BRANCH}/public/contents/${
      categoryInfo.categoryAlias
    }/zips/${filename}.zip`,
    alias: `hikes/tour/${tourLink}`,
    category: [categoryInfo.categoryName],
    image: "/default/hike-default.png",
    time: `${time} Mins`,
    filename: `${filename}.zip`,
  };
};

const unlinkTemp = async () => {
  try {
    var files = fs.readdirSync(TEMP_FOLDER);
  } catch (e) {
    return;
  }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = TEMP_FOLDER + "/" + files[i];
      if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
      else rmDir(filePath);
    }
};

const storeData = async (data) => {
  const serializeData = autoSerialize(data);

  const normalizeDetails = serializeData.details.replaceAll(
    "http://localhost:3200/temp",
    `/volt-mx-tutorials/contents/${
      serializeData.categoryInfo.categoryAlias
    }/assets`
  );

  serializeData.details = normalizeDetails;

  const category = serializeData.categoryInfo;

  delete serializeData.tourLink;
  delete serializeData.categoryInfo;

  category.categoryTours.push(serializeData);

  try {
    fs.writeFileSync(
      `${EXPORT_FOLDER}/tours.json`,
      JSON.stringify(category, null, 2)
    );
  } catch (err) {
    console.error(err);
  }

  return JSON.stringify(serializeData, null, 2);
};

const storeImages = async () => {
  fs.readdirSync("./public/temp").forEach((file) => {
    fs.copyFile(
      `./public/temp/${file}`,
      "./temp/assets/iris-desktop.png",
      (err) => {
        if (err) throw err;
        console.log(`${file} was copied to ${file}`);
      }
    );
  });
};

export default async function handler(req, res) {
  const jsonOutput = await storeData(req.body);

  res.status(200).json(jsonOutput);
}
