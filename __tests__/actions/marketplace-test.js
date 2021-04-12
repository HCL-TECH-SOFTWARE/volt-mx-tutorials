import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import mockAxios from 'jest-mock-axios';
import * as types from '../../src/actions/actionTypes';
import * as actions from '../../src/actions/marketplace';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Marketplace actions', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it('should create an action to set viz Web', () => {
    const expectedAction = {
      type: types.SET_VIZ_WEB,
      payload: true,
    };
    expect(actions.setVizWeb(true)).toEqual(expectedAction);
  });

  it('should create an action to set viz app', () => {
    const expectedAction = {
      type: types.SET_VIZ_APP,
      payload: true,
    };
    expect(actions.setVizApp(true)).toEqual(expectedAction);
  });

  it('get asset details', () => {
    const assetId = 20648;
    const store = mockStore({ });
    // eslint-disable-next-line no-unused-vars
    const res = mockAxios.get('api/v1_0/marketplace/item/20648/releases');
    expect(mockAxios.get).toHaveBeenCalledWith('api/v1_0/marketplace/item/20648/releases');

    const expectedActions = [
      { type: types.SET_CURRENT_ASSET },
    ];
    store.dispatch(actions.getAssetDetails(assetId)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
