import _find from 'lodash/find';
import axios from 'axios';
import { instance as axiosGlobal } from '../utils/initialize';
import * as actionType from './actionTypes';
import { siteBaseURL } from '../config/settings';

export const setVizWeb = payload => ({ type: actionType.SET_VIZ_WEB, payload });
export const setVizApp = payload => ({ type: actionType.SET_VIZ_APP, payload });
export const setUserType = payload => ({ type: actionType.SET_USER_TYPE, payload });
export const setVizVersion = payload => ({ type: actionType.SET_VIZ_VERSION, payload });

export const fetchBasecampUser = email => async (dispatch) => {
  try {
    const res = await axiosGlobal.get('api/v1_0/marketplace/basecamp/get/user-info', {
      params: {
        email,
      },
    });
    if (res.data.userList && res.data.userList.length > 0) {
      await dispatch({
        type: actionType.SET_BASECAMP_USER,
        payload: res.data.userList[0],
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getConfig = (noConfig, platform, nfiversion) => async (dispatch) => {
  try {
    let menuItems = [];
    const assetConfig = [];
    let config = {};
    const cacheFileLocation = '/static/api_cache_files/';
    let cacheFileName = 'api_v1_1_marketplace_configurations.json';
    if (platform && platform !== '' && !nfiversion) {
      cacheFileName = `api_v1_1_marketplace_configurations_${platform}.json`;
    } else if (nfiversion && nfiversion !== '' && !platform) {
      cacheFileName = `api_v1_1_marketplace_configurations_${nfiversion}.json`;
    } else if (nfiversion && platform) {
      cacheFileName = `api_v1_1_marketplace_configurations_${platform}_${nfiversion}.json`;
    }

    const cacheFile = `${siteBaseURL}${cacheFileLocation}${cacheFileName}`;

    try {
      const res = await axios.get(cacheFile);
      config = res.data;
    } catch (err) {
      try {
        const res = await axiosGlobal.get('api/v1_1/marketplace/configurations', {
          headers: {
            'X-KONY-PLATFORM-VERSION': (platform && platform !== '') ? platform : 'all',
            'X-KONY-NFI-VERSION': (nfiversion && nfiversion !== '') ? nfiversion : 'all',
          },
        });
        config = res.data;
      } catch (error) {
        throw (error);
      }
    }

    if (config.header.menu.length > 0) {
      menuItems = config.header.menu
        .filter(item => item.menuParent === 0)
        .map(item => ({
          id: item.menuID,
          url: item.menuURL,
          title: item.menuTitle,
          weight: item.menuWeight,
          subMenu: [],
          parent: item.menuParent,
        }));
      config.header.menu.filter(item => item.menuParent !== 0).map((item) => {
        menuItems.map((menu) => {
          if (menu.id === item.menuParent) {
            menu.subMenu.push({
              id: item.menuID,
              url: item.menuURL,
              title: item.menuTitle,
              weight: item.menuWeight,
              submenuItems: [],
              parent: item.menuParent,
            });
          }
        });
      });
    }
    if (config.configurations && !noConfig) {
      const { featured, domains } = config.configurations;
      if (featured && featured.length > 0) {
        assetConfig.push({ name: 'featured', type: 'featured', assets: featured });
      }
      if (domains.length > 0) {
        domains.map((item) => {
          let localName = item.domain_name;
          let type = 'domain';
          if (localName.includes('@')) {
            type = localName.split('@')[0];
            localName = localName.split('@')[1];
          }
          assetConfig.push({
            name: localName,
            type,
            slug: localName
              .split(' ')
              .join('_')
              .toLowerCase(),
            assets: item.domain_assets,
          });
        });
      }
    }

    dispatch({
      type: actionType.SET_CONFIG,
      payload: { menu: menuItems, footer: config.footer, domains: assetConfig },
    });
  } catch (error) {
    console.log({ error });
  }
};

export const getAssetDetails = (id, platform, nfiversion) => async (dispatch) => {
  try {
    let res = {};
    if (platform && !nfiversion) {
      res = await axiosGlobal.get(`api/v1_0/marketplace/item/${encodeURI(id)}/releases`, {
        headers: {
          'X-KONY-PLATFORM-VERSION': platform,
        },
      });
    } else if (nfiversion && !platform) {
      res = await axiosGlobal.get(`api/v1_0/marketplace/item/${encodeURI(id)}/releases`, {
        headers: {
          'X-KONY-NFI-VERSION': nfiversion,
        },
      });
    } else if (nfiversion && platform) {
      res = await axiosGlobal.get(`api/v1_0/marketplace/item/${encodeURI(id)}/releases`, {
        headers: {
          'X-KONY-PLATFORM-VERSION': platform,
          'X-KONY-NFI-VERSION': nfiversion,
        },
      });
    } else {
      res = await axiosGlobal.get(`api/v1_0/marketplace/item/${encodeURI(id)}/releases`);
    }

    const latestPublishedAssetID = res.data.assetsOrder
      && res.data.assetsOrder.latest_published_asset
      ? res.data.assetsOrder.latest_published_asset : res.data.releaseDetails[0].ID;

    const currentAssetDetails = {
      selectedAsset: res.data.releaseDetails && res.data.releaseDetails.length > 0
        ? _find(res.data.releaseDetails, ['ID', Number(latestPublishedAssetID)])
        : null,
      totalAssets: res.data.totalReleases,
      assetList: res.data.releaseDetails,
      assetTitle: res.data.Title,
      metaDetails: res.data.assetsOrder,
      isCoreAsset: res.data.CoreAsset,
      isContactUs: res.data.ContactUs,
      isNotified: res.data.IsNotified,
      itemId: Number(res.data.ItemId),
      isLiked: res.data.IsLiked,
    };

    dispatch({
      type: actionType.SET_CURRENT_ASSET,
      payload: currentAssetDetails,
    });
  } catch (error) {
    console.log({ error });
  }
};
