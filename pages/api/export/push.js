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
const { exec } = require("child_process");
const { promisify } = require("util");
const gitRemoteOriginUrl = require("git-remote-origin-url");

const copyFile = promisify(fs.copyFile);

const EXPORT_PATH = "./export";

const moveAssets = async (repoName, category) => {
  const REMOTE_PATH = `${repoName}/public/contents/${category}/assets`;

  const transferAssets = () => {
    fs.readdirSync(`${EXPORT_PATH}/assets`).forEach((file) => {
      fs.copyFile(
        `${EXPORT_PATH}/assets/${file}`,
        `${REMOTE_PATH}/${file}`,
        (err) => {
          if (err) throw err;
          console.log(`${file} was copied to ${REMOTE_PATH}/${file}`);
        }
      );
    });
  };

  if (fs.existsSync(REMOTE_PATH)) {
    transferAssets();
  } else {
    fs.mkdirSync(REMOTE_PATH);
    transferAssets();
  }
};

const moveAssetsToRemote = async ({ repoName, category, filename }) => {
  // move tours.json
  await copyFile(
    `${EXPORT_PATH}/tours.json`,
    `${repoName}/public/contents/${category}/tours.json`
  );

  console.log(
    `tours.json was copied to ${repoName}/public/contents/${category}/tours.json`
  );

  // tour file (.zip)
  await copyFile(
    `${EXPORT_PATH}/${filename}`,
    `${repoName}/public/contents/${category}/zips/${filename}`
  );

  console.log(
    `${filename} was copied to ${repoName}/public/contents/${category}/${filename}`
  );

  await moveAssets(repoName, category);
};

const getRemoteUrl = async () => {
  return (async () => {
    return await gitRemoteOriginUrl();
  })();
};

const pushToFork = async (data, files, res, req) => {
  const { repoName, remoteName, branchName } = data;

  exec(`git clone ${remoteName}`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    }

    exec(
      `cd ${repoName} && git checkout -b ${branchName}`,
      async (err, out, stderrr) => {
        if (stderrr) {
          console.log(err);
        }

        // show git clone logs
        console.log(out);

        await moveAssetsToRemote(files);

        exec(
          `cd ${repoName} && git add public && git commit -m "added ${branchName}"`,
          () => {
            exec(`cd ${repoName} && git push origin ${branchName}`, () => {
              exec(`rm -rf ${repoName}`, () => {
                res.status(200).json({
                  success: true,
                  details: req.body,
                  remoteName,
                });
                console.log(
                  `changes has been successfully pushed into ${repoName} via ${branchName} branch`
                );
              });
            });
          }
        );
      }
    );
  });
};

export default async function handler(req, res) {
  const { branchName, filename, category } = req.body;
  const repoName = "volt-mx-tutorials";
  const remoteName = await getRemoteUrl();

  if (req.method === "POST") {
    // push to fork repository
    await pushToFork(
      { repoName, remoteName, branchName },
      { repoName, category, filename },
      res,
      req
    );
  }
}
