/* ========================================================================== *
 *                 Copyright (c) 2021 HCL America, Inc.                       *
 *                            All rights reserved.                            *
 * ========================================================================== *
 * Licensed under the  Apache License, Version 2.0  (the "License").  You may *
 * not use this file except in compliance with the License.  You may obtain a *
 * copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>.       *
 *                                                                            *
 * Unless  required  by applicable  law or  agreed  to  in writing,  software *
 * distributed under the License is distributed on an  "AS IS" BASIS, WITHOUT *
 * WARRANTIES OR  CONDITIONS OF ANY KIND, either express or implied.  See the *
 * License for the  specific language  governing permissions  and limitations *
 * under the License.                                                         *
 * ========================================================================== */

import { BASE_BRANCH } from "../../../src/config";

const fs = require("fs-extra");

const TEMP_FOLDER = "./temp";
const EXPORT_FOLDER = "./export";

const autoSerialize = (forms) => {
  const { category, filename, tourLink, time, categoryInfo } = forms;

  return {
    ...forms,
    url: `https://opensource.hcltechsw.com/volt-mx-tutorials/hikes/tour/${tourLink}`,
    fileURL: `https://raw.githubusercontent.com/HCL-TECH-SOFTWARE/volt-mx-tutorials/${BASE_BRANCH}/public/contents/${categoryInfo.categoryAlias}/zips/${filename}.zip`,
    alias: `hikes/tour/${tourLink}`,
    category: [categoryInfo.categoryName],
    image: "/default/hike-default.png",
    time: `${time} Mins`,
    filename: `${filename}.zip`,
  };
};

const moveAssets = async (details) => {
  // remove old assets
  const EXPORT_PATH = `${EXPORT_FOLDER}/assets`;
  fs.emptyDirSync(EXPORT_PATH);

  const dirPath = `./public/${TEMP_FOLDER}/assets`;
  fs.readdirSync(dirPath).forEach((file) => {
    const isExist = details.indexOf(file);
    if (isExist !== -1) {
      fs.copyFile(`${dirPath}/${file}`, `${EXPORT_PATH}/${file}`, (err) => {
        if (err) throw err;
        console.log(`${file} was copied to ${EXPORT_PATH}/${file}`);
      });
    }
  });
};

const storeData = async (data) => {
  const serializeData = autoSerialize(data);

  const normalizeDetails = serializeData.details.replaceAll(
    "http://localhost:3200/temp",
    `/volt-mx-tutorials/contents/${serializeData.categoryInfo.categoryAlias}`
  );

  serializeData.details = normalizeDetails;

  await moveAssets(normalizeDetails);

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

export default async function handler(req, res) {
  const jsonOutput = await storeData(req.body);

  res.status(200).json(jsonOutput);
}
