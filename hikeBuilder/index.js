/* ========================================================================== *
 * Copyright (c) 2021 HCL America, Inc.                       *
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
const args = process.argv;
const IRIS_PATH = args.slice(2)[0];
const INSTALL_CMD = `node addon -i ${__dirname}/hikeBuilder.zip`;
const UNINSTALL_CMD = `node addon -u hikeBuilder`;

// exec(
//   INSTALL_CMD,
//   {
//     cwd: IRIS_PATH,
//   },
//   (err, stdout, stderr) => {
//     if (err) {
//       // node couldn't execute the command
//       console.log(err);
//       return;
//     }

//     console.log(stdout);
//   }
// );

console.log(process.argv);
