import _uniqWith from 'lodash/uniqWith';
import _isEqual from 'lodash/isEqual';
import * as actionType from '../actions/actionTypes';

const INITIAL = {
  list: {},
  currentList: [],
  filters: {
    domain: [],
    category: [],
    channels: [],
    platform: [],
    nfiversion: [],
    tags: [],
    sortBy: [
      {
        id: 'newest',
        title: 'Newest',
        selected: false,
      },
      {
        id: 'popular',
        title: 'Popularity',
        selected: true,
      },
      {
        id: 'likes',
        title: 'Likes',
        selected: false,
      },
      {
        id: 'name',
        title: 'Name',
        selected: false,
      },
    ],
    mpType: [
      {
        id: 'public',
        title: 'Public',
        selected: false,
      },
      {
        id: 'private',
        title: 'Private',
        selected: false,
      },
      {
        id: 'all',
        title: 'All',
        selected: false,
      },
    ],
  },
  filtersLoading: true,
  didyoumean: '',
  selectedFilters: {},
  assetCount: 0,
  totalAssetCount: 0,
  loadMore: false,
  loading: false,
  headers: {
    'X-KONY-SORTBY': null,
    'X-KONY-CATEGORY': null,
    'X-KONY-PLATFORM-VERSION': null,
    'X-KONY-NFI-VERSION': null,
    'X-KONY-KEYWORD': null,
    'X-KONY-TAG': null,
    'X-KONY-ACCOUNT-ID': null,
    'X-KONY-MARKETPLACE-TYPE': null,
  },
};

export default (state = INITIAL, { type, payload }) => {
  switch (type) {
    case actionType.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...payload },
      };
    case actionType.SET_SELECTED_FILTERS:
      return {
        ...state,
        selectedFilters: payload,
      };
    case actionType.SET_FILTERS_LOADING:
      return {
        ...state,
        filtersLoading: payload,
      };
    case actionType.SET_ASSETS:
      return {
        ...state,
        list: _uniqWith([...payload], _isEqual),
      };
    case actionType.UPDATE_ASSETS:
      let { params, data, originalList } = payload;
      const { offset } = params;
      originalList[offset] = _uniqWith([...data], _isEqual);
      return {
        ...state,
        currentList: data,
        list: originalList,
      };
    case actionType.SET_ASSET_COUNT:
      return { ...state, assetCount: payload };
    case actionType.SET_DID_YOU_MEAN:
      return { ...state, didyoumean: payload };
    case actionType.SET_TOTAL_ASSET_COUNT:
      return { ...state, totalAssetCount: payload };
    case actionType.INCREMENT_ASSET_COUNT:
      return { ...state, assetCount: state.list.length };
    case actionType.SET_LOAD_MORE:
      return { ...state, loadMore: payload };
    case actionType.SET_ASSETS_LOADING:
      return { ...state, loading: payload };
    case actionType.SET_HEADERS:
      return { ...state, headers: payload };
    case actionType.UPDATE_HEADERS:
      return { ...state, headers: payload };
    default:
      return state;
  }
};
