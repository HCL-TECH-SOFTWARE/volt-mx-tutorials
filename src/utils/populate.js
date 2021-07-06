import axios from 'axios';
import i18next from 'i18next';
import getConfig from 'next/config';
import { SERVER } from '../config';

const { publicRuntimeConfig } = getConfig();

const mergeTranslatedJson = (lang, json) => {
  for (const key in lang) {
    if (typeof (lang[key]) === 'object') {
      mergeTranslatedJson(lang[key], json[key]);
    } else if (json.hasOwnProperty(key)) {
      json[key] = lang[key];
    }
  }
};

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
  const urls = hikesUrls.map(url => axios.get(`${SERVER}/contents/${url}/tours.json`));

  const responses = await axios.all(urls);

  // map all response data into single array
  const categories = responses.map(res => res.data);
  for (const url of hikesUrls.values()) {
    try {
      const translatedTours = await axios.get(`${SERVER}/contents/${url}/tours_${i18next.language}.json`);
      for (const response of responses) {
        const responseUrl = response.config.url.split('/');
        const hikeUrl = responseUrl[responseUrl.length - 2];
        if (hikeUrl === url) {
          mergeTranslatedJson(translatedTours.data, response.data);
        }
      }
    } catch (error) {
      console.log('Fail to get %o tours files of %o', i18next.language, url);
    }
  }
  return categories;
};

export const getMapCategories = async () => {
  const { hikesData } = publicRuntimeConfig;
  const hikes = await getHikesCategories(hikesData);
  return hikes;
};
