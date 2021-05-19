const fs = require("fs");
const formidable = require("formidable");
const path = require("path");

const TEMP_FOLDER = "./temp";

const autoSerialize = (forms) => {
  const { category, filename } = forms;
  return {
    ...forms,
    url:
      "https://opensource.hcltechsw.com/volt-mx-tutorials/hikes/tour/create-ui-collections",
    fileURL: `https://raw.githubusercontent.com/HCL-TECH-SOFTWARE/volt-mx-tutorials/phx-dev/public/contents/${category}/${filename}`,
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
  try {
    fs.writeFileSync(
      `${TEMP_FOLDER}/tours.json`,
      JSON.stringify(serializeData, null, 2)
    );
  } catch (err) {
    console.error(err);
  }
};

const copyOriginalZipFile = ({ tempZipFilePath, filename }) => {
  fs.copyFile(tempZipFilePath, `${TEMP_FOLDER}/${filename}`, (err) => {
    if (err) throw err;
    console.log(`${tempZipFilePath} was copied to ${TEMP_FOLDER}/${filename}`);
  });
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm({
    keepExtensions: true,
    uploadDir: "./public/temp",
  });

  form.parse(req, function(err, fields, files) {
    if (!err) {
      const { name, path } = files.upload;
      const assetURL = `https://raw.githubusercontent.com/HCL-TECH-SOFTWARE/volt-mx-tutorials/phx-dev/public/default/.pnghttps://raw.githubusercontent.com/HCL-TECH-SOFTWARE/volt-mx-tutorials/phx-dev/public/contents/1-volt-mx-changes/assets/${name}.png`;

      const tempName = path.replace("public/temp/", "");

      const uploadSuccess = {
        uploaded: true,
        fileName: name,
        url: `http://localhost:3200/temp/${tempName}`,
      };
      res.status(200).json(uploadSuccess);
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
