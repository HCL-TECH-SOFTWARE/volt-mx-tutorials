const fs = require("fs");
const formidable = require("formidable");
const path = require("path");

const TEMP_FOLDER = "./temp";

export default async function handler(req, res) {
  //   copyOriginalZipFile(req.body);
  //   delete req.body.tempZipFilePath;
  //   storeData(req.body);
  //   storeImages();
  res.status(200).json({
    success: 200,
  });
}
