const fs = require("fs");
const formidable = require("formidable");
const path = require("path");

const TEMP_FOLDER = "./temp";

const autoSerialize = (forms) => {
  const { category, filename, tourLink } = forms;
  return {
    ...forms,
    url: `https://opensource.hcltechsw.com/volt-mx-tutorials/hikes/tour/${tourLink}`,
    fileURL: `https://raw.githubusercontent.com/HCL-TECH-SOFTWARE/volt-mx-tutorials/phx-dev/public/contents/${category}/${filename}`,
    alias: `hikes/tour/${tourLink}`,
    category: [category],
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
  delete serializeData.tourLink;
  const category = serializeData.categoryInfo;
  delete serializeData.categoryInfo;
  console.log();

  const jsonOut = {
    ...category,
    categoryTours: [serializeData, ...category.categoryTours],
  };

  try {
    fs.writeFileSync(
      `${TEMP_FOLDER}/tours.json`,
      JSON.stringify(jsonOut, null, 2)
    );
  } catch (err) {
    console.error(err);
  }
};

const storeImages = async () => {
  fs.readdirSync("./public/temp").forEach((file) => {
    fs.copyFile(
      `./public/temp/${file}`,
      "./temp/assets/iris-desktop.png",
      (err) => {
        if (err) throw err;
        console.log(`${file} was copied to destination.txt`);
      }
    );
  });
};

const copyOriginalZipFile = ({ tempZipFilePath, filename }) => {
  fs.copyFile(tempZipFilePath, `${TEMP_FOLDER}/${filename}`, (err) => {
    if (err) throw err;
    console.log(`${tempZipFilePath} was copied to ${TEMP_FOLDER}/${filename}`);
  });
};

export default async function handler(req, res) {
  copyOriginalZipFile(req.body);
  delete req.body.tempZipFilePath;
  storeData(req.body);
  storeImages();
  res.status(200).json({
    ...req.body,
  });
}
