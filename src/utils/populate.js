import axios from "axios";
import getConfig from "next/config";
import { SERVER } from "../config";
const { publicRuntimeConfig } = getConfig();

/**
 * Fetch all hikes data in /public/contents directory.
 *
 *
 * @param hikesUrls, Array of Folder names.
 *
 * @return Array.
 */
export const getHikesCategories = async (hikesUrls) => {
  // map all data into one request
  const urls = hikesUrls.map((url) => {
    return axios.get(`${SERVER}/contents/${url}/tours.json`);
  });

  const responses = await axios.all(urls);

  // map all response data into single array
  const categories = responses.map((res) => {
    return res.data;
  });

  return categories;
};

export const getMapCategories = async () => {
  const { hikesData } = publicRuntimeConfig;
  const hikes = await getHikesCategories(hikesData);
  return hikes;
};
