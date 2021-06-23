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

const fs = require("fs");
const crypto = require("crypto");

/**
 * @param stringBuffer {String}
 * @returns {sha256 file checksum}
 */
const generateChecksum = async (str) => {
  return await crypto.createHash("sha256").update(str, "utf8").digest("hex");
};

/**
 * @param b64string {String}
 * @returns {Buffer}
 */
const _decodeBase64ToUtf8 = (b64string) => {
  var buffer;
  if (typeof Buffer.from === "function") {
    // Node 5.10+
    buffer = Buffer.from(b64string, "base64");
  } else {
    // older Node versions
    buffer = new Buffer(b64string, "base64");
  }

  return buffer;
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { data, id } = req.body;

    const decode = _decodeBase64ToUtf8(data);

    fs.writeFile(`./export/${id.toLowerCase()}.zip`, decode, async (err) => {
      // generate file checksum (sha-256)
      const checksum = await generateChecksum(decode);
      res.status(200).json({ checksum });
    });
  }
}
