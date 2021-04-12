import _sortBy from 'lodash/sortBy';
import { instance as axios } from '../utils/initialize';
import * as actionType from './actionTypes';

export const setAssets = payload => ({ type: actionType.SET_ASSETS, payload });

export const setFilters = payload => ({
  type: actionType.SET_FILTERS,
  payload,
});
export const setFiltersLoading = payload => ({
  type: actionType.SET_FILTERS_LOADING,
  payload,
});
export const updateAssets = payload => ({
  type: actionType.UPDATE_ASSETS,
  payload,
});
export const incrementAssetCount = () => ({
  type: actionType.INCREMENT_ASSET_COUNT,
});
export const setTotalAssetCount = payload => ({
  type: actionType.SET_TOTAL_ASSET_COUNT,
  payload,
});
export const setLoadMore = payload => ({
  type: actionType.SET_LOAD_MORE,
  payload,
});
export const setHeaders = payload => ({
  type: actionType.SET_HEADERS,
  payload,
});
export const setDidYouMean = payload => ({
  type: actionType.SET_DID_YOU_MEAN,
  payload,
});
export const setAssetsLoading = payload => ({
  type: actionType.SET_ASSETS_LOADING,
  payload,
});
export const setSelectedFilters = payload => ({
  type: actionType.SET_SELECTED_FILTERS,
  payload,
});

export const loadAssets = (params, headers, originalList) => async (dispatch) => {
  try {
    dispatch(setAssetsLoading(true));
    const res = await axios.get('/api/v2_0/marketplace/item', {
      headers,
      params: params || {
        count: 10,
        offset: 0,
      },
    });
    if (Number(res.data.AssetCount) > 0) {
      const payload = {
        data: res.data.Details,
        params,
        originalList: originalList || {},
      };
      dispatch(updateAssets(payload));
      dispatch(setTotalAssetCount(res.data.TotalAssetCount));
      dispatch(incrementAssetCount());
      dispatch(setLoadMore(true));
    }
    if (Number(res.data.AssetCount) < 10) {
      dispatch(setLoadMore(false));
    }
    dispatch(setDidYouMean(res.data.didYouMean));
    return dispatch(setAssetsLoading(false));
  } catch (error) {
    dispatch(setAssetsLoading(false));
    dispatch(setLoadMore(false));
  }
};

export const loadFilters = () => async (dispatch) => {
  try {
    dispatch(setFiltersLoading(true));
    const filters = {};
    let filterRes = {};
    try {
      const res = await axios.get(
        '/sites/default/files/api_cache_files/api_v1_0_marketplace_filter_options.json', {
          headers: {
            'Cache-Control': 'no-cache',
          },
        },
      );
      filterRes = res.data;
    } catch (err) {
      try {
        const res = await axios.get('/api/v1_0/marketplace/filter_options');
        filterRes = res.data;
      } catch (err) {
        throw err;
      }
    }
    const {
      categories, platforms, tags, domains, channels, nfiVersions,
    } = filterRes;

    if (domains) {
      filters.domain = _sortBy(domains, 'domainWeight').map(item => ({
        id: item.domainTitle
          .split(' ')
          .join('_')
          .toLowerCase(),
        domainId: item.domainID,
        title: item.domainTitle,
        slug: item.domainTitle
          .split(' ')
          .join('_')
          .toLowerCase(),
        parent: item.domainParent,
        selected: false,
      }));
      filters.subdomain = [...filters.domain];
    }

    if (categories) {
      filters.category = _sortBy(categories, 'categoryWeight')
        .filter(item => Number(item.categoryParent) === 0 && item.categoryTitle !== 'Archive')
        .map(item => ({
          id: item.categoryID.toString(),
          title: item.categoryTitle,
          selected: false,
        }));
    }
    if (platforms) {
      filters.platform = _sortBy(platforms, 'platformVersionWeight')
        .filter(
          item => Number(item.platformVersionParent) === 0
            && item.platformVersionTitle !== 'Visualizer 7.3',
        )
        .map(item => ({
          id: item.platformVersionID.toString(),
          title: item.platformVersionTitle,
          selected: false,
        }));
    }

    if (nfiVersions) {
      filters.nfiversion = _sortBy(nfiVersions, 'nfiVersionWeight')
        .map(item => ({
          id: item.nfiVersionTitle ? item.nfiVersionTitle.toString() : '',
          title: item.nfiVersionTitle,
          selected: false,
        }));
    }

    if (tags) {
      filters.tags = tags.filter(item => item.Name !== 'Kony DBX').map(item => ({
        id: item.tid.toString(),
        title: item.name,
        selected: false,
      }));
    }

    if (channels) {
      filters.channels = _sortBy(channels, 'channelsWeight')
        .map(item => ({
          id: item.channelsTitle.toString(),
          title: item.channelsTitle,
          selected: false,
        }));
    }

    dispatch(setFiltersLoading(false));
    dispatch(setFilters(filters));
  } catch (error) {
    dispatch(setFiltersLoading(false));
    console.log(error);
  }
};
