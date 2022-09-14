import axios from 'axios';
import getConfig from 'next/config';
import _get from 'lodash/get';
import _merge from 'lodash/merge';
import _mergeWith from 'lodash/mergeWith';
import _zipObject from 'lodash/zipObject';
import _isArray from 'lodash/isArray';
import { SERVER } from '../config';
import i18next, { locales } from '../../i18n';

const { publicRuntimeConfig } = getConfig();

/**
 * Lodash mergeWith customizer
 * Custom function for merging category obj with the localization obj
 * Merges the 'categoryTours' key by nid
 * @param {*} objValue destination object value
 * @param {*} srcValue source object value
 * @param {*} key key name
 * @returns merged array if key = 'categoryTours', undefined otherwise (i.e lodash default logic)
 */
const mergeCategoryLocalization = (objValue, srcValue, key) => {
  if (key === 'categoryTours' && _isArray(objValue) && _isArray(srcValue)) {
    const result = objValue.map((objItem) => {
      const itemToMerge = srcValue.find(srcItem => srcItem.nid === objItem.nid);
      return _merge({}, objItem, itemToMerge);
    });
    return result;
  }
  return undefined;
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
  const getCategoryLocalization = async (url) => {
    const localization = (await Promise.all(
      locales.map(
        locale => axios.get(`${SERVER}/contents/${url}/tours_${locale}.json`)
          .catch(() => ({})), // in case localization file is not found
      ),
    )).map(res => res.data);
    return _zipObject(locales, localization);
  };

  const categories = (await Promise.all(
    hikesUrls.map(url => axios.get(`${SERVER}/contents/${url}/tours.json`)),
  )).map(res => res.data);
  const localizations = (await Promise.all(hikesUrls.map(url => getCategoryLocalization(url))))
    .map(localization => ({
      localization,
    }));

  return _mergeWith(
    [],
    categories,
    localizations,
    mergeCategoryLocalization,
  );
};

export const translateCategory = (category, locale) => _mergeWith(
  {},
  category,
  _get(category, ['localization', locale || i18next.language], {}),
  mergeCategoryLocalization,
);

export const getMapCategories = async (translate = true) => {
  const { hikesData } = publicRuntimeConfig;
  const hikes = await getHikesCategories(hikesData);
  if (translate) {
    return hikes.map(hike => translateCategory(hike));
  }
  return hikes;
};
