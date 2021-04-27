import { BASE_PATH_URL, GITHUB_NAME, isDev } from "../config";

/**
 *  Get Github Branch Name
 * @returns {string} Returns branch name.
 */
export const getBranchName = () => {
    // const branch = isDev ? ''
    return 'hikes-assets';
}

/**
 *  Get Download Zip Url
 * @param {string} string - Filename of zip file.
 * @param {string} string - Category alias.
 * @returns {string} Returns url download path.
 */
export const getZipDownloadUrl = (zipName, categoryName) => {
    const branchName = getBranchName();
    const fileUrl = `https://raw.githubusercontent.com/${GITHUB_NAME}/${BASE_PATH_URL}/${branchName}/public/contents/${categoryName}/zips/${zipName}.zip`;

    return fileUrl;
}
