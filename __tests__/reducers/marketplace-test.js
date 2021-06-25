import mockAxios from 'jest-mock-axios';
import * as types from '../../src/actions/actionTypes';
import reducer from '../../src/reducers';

describe('Marketplace reducers', () => {
  const INITIAL_STATE = {
    assets: {
      list: [],
      filters: {
        channels: [],
        domain: [],
        nfiversion: [],
        category: [],
        platform: [],
        tags: [],
        mpType: [
          {
            id: 'public',
            selected: false,
            title: 'Public',
          },
          {
            id: 'private',
            selected: false,
            title: 'Private',
          },
          {
            id: 'all',
            selected: false,
            title: 'All',
          },
        ],
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
          {
            id: 'kony',
            title: 'Created By Kony',
            selected: false,
          },
          {
            id: 'community',
            title: 'Created By Community',
            selected: false,
          },
        ],
      },
      filtersLoading: true,
      selectedFilters: {},
      assetCount: 0,
      totalAssetCount: 0,
      didyoumean: '',
      loadMore: false,
      loading: false,
      headers: {
        'X-KONY-SORTBY': null,
        'X-KONY-CATEGORY': null,
        'X-KONY-PLATFORM-VERSION': null,
        'X-KONY-KEYWORD': null,
        'X-KONY-TAG': null,
        'X-KONY-ACCOUNT-ID': null,
        'X-KONY-MARKETPLACE-TYPE': null,
        'X-KONY-NFI-VERSION': null,
      },
      params: {},
    },
    marketplace: {
      config: {},
      isLogin: false,
      currentAsset: {},
      isVizApp: false,
      isVizWeb: false,
      userType: '',
      user: {
        whoami: null,
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
      nfiversion: '',
      platform: '',
    },
  };
  afterEach(() => {
    mockAxios.reset();
  });

  it('returns the initial state', () => {
    expect(reducer(undefined, {}))
      .toEqual(INITIAL_STATE);
  });

  it('handles setting viz app to true', () => {
    expect(reducer(INITIAL_STATE, { type: types.SET_VIZ_APP, payload: true })).toEqual({
      ...INITIAL_STATE,
      marketplace: {
        ...INITIAL_STATE.marketplace,
        isVizApp: true,
      },
    });
  });
});
