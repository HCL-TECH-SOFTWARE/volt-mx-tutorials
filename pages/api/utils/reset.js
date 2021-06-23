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

const fs = require("fs-extra");

export default async function handler(req, res) {
  const TEMP_FOLDER = "./public/temp";
  const EXPORT_FOLDER = "./export";
  if (req.method === "POST") {
    const EXPORT_ASSETS_PATH = `${EXPORT_FOLDER}/assets`;
    const TEMP_ASSETS_PATH = `${TEMP_FOLDER}/assets`;

    // Delete old exports assets/temps
    fs.emptyDirSync(EXPORT_ASSETS_PATH);
    fs.emptyDirSync(TEMP_FOLDER);
    fs.emptyDirSync(TEMP_ASSETS_PATH);

    // Delete old fork repository
    const CACHED_REPO_PATH = "./volt-mx-tutorials";
    if (fs.existsSync(CACHED_REPO_PATH)) {
      fs.removeSync(CACHED_REPO_PATH, { recursive: true });
    }

    res.status(200).json({ success: true });
  }
}
