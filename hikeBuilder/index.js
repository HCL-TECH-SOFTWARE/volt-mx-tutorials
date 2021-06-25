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

const { exec } = require("child_process");
const IRIS_PATH = process.env.npm_config_path;
const INSTALL_CMD = `node addon -i ${__dirname}/hikeBuilder.zip`;
const UNINSTALL_CMD = `node addon -u hikeBuilder`;

const task = process.argv.slice(2)[0];

const CMD = task ? UNINSTALL_CMD : INSTALL_CMD;

exec(
  CMD,
  {
    cwd: IRIS_PATH,
  },
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(stdout);
  }
);
