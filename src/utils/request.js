import {
  BASE_BRANCH,
  BASE_PATH_URL,
  DEV_PORT,
  GITHUB_NAME,
  isDev,
} from "../config";

/**
 *  Get Github Branch Name
 * @returns {string} Returns branch name.
 */
export const getBranchName = () => {
  return process.env.GIT_BRANCH;
};

/**
 *  Get Download Zip Url
 * @param {string} string - Filename of zip file.
 * @param {string} string - Category alias.
 * @returns {string} Returns url download path.
 */
export const getZipDownloadUrl = (zipName, categoryName) => {
  const branchName = getBranchName() || BASE_BRANCH;
  const localZipUrl = `http://localhost:${DEV_PORT}/api/zip/${zipName}`;
  const remoteZipUrl = `https://raw.githubusercontent.com/${GITHUB_NAME}/${BASE_PATH_URL}/${branchName}/public/contents/${categoryName}/zips/${zipName}`;

  const fileUrl = isDev ? localZipUrl : remoteZipUrl;

  return fileUrl;
};
