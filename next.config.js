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

const webpack = require("webpack");
const withSass = require("@zeit/next-sass");
const withImages = require("next-images");
const prod = process.env.NODE_ENV === "production";
const test = process.env.NODE_ENV === "testing";
const {
  getHikeDirectories,
  tours,
  HIKES_BASE_URL,
  getHikeTours,
} = require("./hike.config");
const currentGitBranchName = require("current-git-branch");

const getProdUrl = prod ? `/${HIKES_BASE_URL}` : "";

module.exports = withImages(
  withSass({
    cssModules: true,
    cssLoaderOptions: {
      localIdentName: prod
        ? "[hash:base64:5]"
        : test
        ? "[path]_[local]"
        : "[path]_[local]--[hash:base64:5]",
      sourceMap: true,
    },
    env: {
      GIT_BRANCH: currentGitBranchName(),
    },
    assetPrefix: getProdUrl,
    publicRuntimeConfig: {
      asset: getProdUrl,
      hikesData: getHikeDirectories(),
      hikeTours: getHikeTours(),
    },
    exportPathMap: () => tours,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.node = {
          fs: "empty",
          net: "empty",
          tls: "empty",
        };
      }
      return config;
    },
  })
);
