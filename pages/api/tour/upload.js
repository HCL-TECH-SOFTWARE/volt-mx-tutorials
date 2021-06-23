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

const fs = require("fs");
const formidable = require("formidable");

const TEMP_FOLDER = "./public/temp";

export default async function handler(req, res) {
  const { checksum } = req.query;
  const form = new formidable.IncomingForm({
    keepExtensions: true,
    uploadDir: TEMP_FOLDER,
  });

  form.parse(req, function (err, fields, files) {
    if (!err) {
      const { name, path } = files.upload;

      const stripChecksum = checksum.slice(0, 10);
      const assetName = `${TEMP_FOLDER}/assets/${stripChecksum}_${name}`;
      const responseAssetURL = `http://localhost:3200/temp/assets/${stripChecksum}_${name}`;

      fs.copyFile(path, assetName, (err) => {
        if (err) throw err;
      });

      const uploadSuccess = {
        uploaded: true,
        fileName: name,
        url: responseAssetURL,
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
