import * as actionType from "./../actions/actionTypes";

const INITIAL = {
  config: {},
  isLogin: false,
  currentAsset: {},
  isVizApp: false,
  isVizWeb: false,
  userType: '',
  platform: '',
  nfiversion: '',
  user: {
    whoami: null
  },
  userId: null,
  cloudAccounts: [],
  moderatorMenu: [],
  hikeAdminMenu: [],
  privateModeratorMenu: [],
  basecampUserInfo: {},
  searchKeyword: '',
  basecampSearchCount: 0,
  basecampSearchData: [],
};

export default (state = INITIAL, { type, payload }) => {
  switch (type) {
    case actionType.SET_CONFIG:
      return { ...state, config: payload };
    case actionType.SET_CURRENT_ASSET:
      return { ...state, currentAsset: payload };
    case actionType.SET_AUTH:
      return { ...state, isLogin: !!payload, user: payload};
    case actionType.SET_BASECAMP_USER:
      return { ...state, basecampUserInfo: payload };
    case actionType.SET_USER_ID:
      return { ...state, userId: payload};
    case actionType.SET_CLOUD_ACCOUNTS:
      return { ...state, cloudAccounts: payload };
    case actionType.SET_MP_MODERATOR_MENU:
      return { ...state, moderatorMenu: payload };
    case actionType.SET_HIKE_ADMIN_MENU:
      return { ...state, hikeAdminMenu: payload };
    case actionType.SET_PRIVATE_MODERATOR_MENU:
      return { ...state, privateModeratorMenu: payload };
    case actionType.SET_VIZ_APP:
      return { ...state, isVizApp: payload};
    case actionType.SET_VIZ_VERSION:
      return { ...state, platform: payload};
    case actionType.SET_NFI_VERSION:
      return { ...state, nfiversion: payload};
    case actionType.SET_USER_TYPE:
      return { ...state, userType: payload};
    case actionType.SET_VIZ_WEB:
      return { ...state, isVizWeb: payload};
    case actionType.SET_BASECAMP_SEARCH_RESULTS:
      return {
        ...state,
        basecampSearchData: payload.data,
        basecampSearchCount: payload.count,
        searchKeyword: payload.keyword,
      };
    default:
      return state;
  }
};
