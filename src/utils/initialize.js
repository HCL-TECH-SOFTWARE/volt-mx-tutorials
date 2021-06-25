import Router from 'next/router';
import axios from 'axios';
import { Base64 } from 'js-base64';
import _size from 'lodash/size';
import * as actionType from '../actions/actionTypes';
import { marketplaceActions } from '../actions';
import { getCookie } from './cookies';
import { baseURL } from '../config/settings';

const tempInstance = axios.create({
  baseURL,
});

export default async function (ctx) {
  if (ctx.isServer) {
    if (ctx.query || ctx.req?.cookies) {
      if (ctx.query?.useragent || ctx.req?.cookies?.useragent) {
        const useragent = ctx.query?.useragent || ctx.req?.cookies?.useragent;
        if (useragent.toLowerCase() === 'visualizer') {
          ctx.store.dispatch(marketplaceActions.setVizWeb(true));
          ctx.res.cookie('useragent', 'visualizer');
          ctx.store.dispatch({
            type: actionType.SET_USER_ID,
            payload: ctx.req?.cookies.viz_user_id,
          });
          if (ctx.query.platform || ctx.req?.cookies.platform) {
            const platform = ctx.query.platform || ctx.req?.cookies.platform;
            ctx.store.dispatch(marketplaceActions.setVizVersion(platform));
            ctx.res.cookie('platform', platform);
          }
          if (ctx.query.nfiversion || ctx.req?.cookies.nfiversion) {
            const nfiversion = ctx.query.nfiversion || ctx.req?.cookies.nfiversion;
            ctx.store.dispatch(marketplaceActions.setVizVersion(nfiversion));
            ctx.res.cookie('nfiversion', nfiversion);
          }
        } else if (useragent.toLowerCase() === 'app-preview') {
          ctx.store.dispatch(marketplaceActions.setVizApp(true));
          ctx.res.cookie('useragent', 'app-preview');
        }
      }

      if (ctx.query?.usertype || ctx.req?.cookies?.usertype) {
        const usertype = ctx.query?.usertype || ctx.req?.cookies?.usertype;
        ctx.store.dispatch(marketplaceActions.setUserType(usertype));
        ctx.res.cookie('usertype', usertype);
      }

      if (ctx.query.cloud_account_id || ctx.req?.cookies?.account_id) {
        const accountId = ctx.query.cloud_account_id || ctx.req?.cookies?.account_id;
        ctx.res.cookie('account_id', accountId);
      }
    }

    // Set X-Kony-Authorization
    if (ctx.req?.cookies) {
      // Handle Authentication
      if (!ctx.req?.cookies.mp_user_id
        || !ctx.req?.cookies.mp_user_info
        || !ctx.req?.cookies.mp_user_data
        || !ctx.req?.cookies.mp_refresh_token) {
        ctx.res.cookie('mp_user_data', '', { maxAge: -1 });
        ctx.res.cookie('mp_refresh_token', '', { maxAge: -1 });
        ctx.res.cookie('mp_claims_token', '', { maxAge: -1 });
        ctx.res.cookie('mp_user_id', '', { maxAge: -1 });
        ctx.res.cookie('mp_user_info', '', { maxAge: -1 });
        ctx.res.cookie('mp_mod_menu', '', { maxAge: -1 });
        ctx.res.cookie('hike_admin_menu', '', { maxAge: -1 });
        ctx.res.cookie('mp_private_mod_menu', '', { maxAge: -1 });
        delete tempInstance.defaults.headers.common['X-Kony-Authorization'];
      } else {
        ctx.store.dispatch({
          type: actionType.SET_USER_ID,
          payload: ctx.req?.cookies.mp_user_id || null,
        });
        ctx.store.dispatch({
          type: actionType.SET_CLOUD_ACCOUNTS,
          payload: ctx.req?.cookies.mp_user_info ? JSON.parse(ctx.req?.cookies.mp_user_info) : [],
        });
        const userData = ctx.req?.cookies.mp_user_data
          ? JSON.parse(Base64.decode(ctx.req?.cookies.mp_user_data))
          : false;
        const auth_token = ctx.req?.cookies.mp_refresh_token || false;
        if (userData && auth_token) {
          tempInstance.defaults.headers.common['X-Kony-Authorization'] = auth_token;
          await ctx.store.dispatch({
            type: actionType.SET_AUTH,
            payload: { whoami: userData },
          });
          ctx.store.dispatch({
            type: actionType.SET_MP_MODERATOR_MENU,
            payload: ctx.req?.cookies.mp_mod_menu
              ? JSON.parse(ctx.req?.cookies.mp_mod_menu)
              : [],
          });
          ctx.store.dispatch({
            type: actionType.SET_HIKE_ADMIN_MENU,
            payload: ctx.req?.cookies.hike_admin_menu
              ? JSON.parse(ctx.req?.cookies.hike_admin_menu)
              : [],
          });
          ctx.store.dispatch({
            type: actionType.SET_PRIVATE_MODERATOR_MENU,
            payload: ctx.req?.cookies.mp_private_mod_menu
              ? JSON.parse(ctx.req?.cookies.mp_private_mod_menu)
              : [],
          });
          await ctx.store.dispatch(marketplaceActions.fetchBasecampUser(userData.primary_email));
        }
      }
    }

    if (ctx.query) {
      const {
        sortBy,
        cloud_account_id,
        category,
        platform,
        keyword,
        domain,
        channels,
        tags,
        author,
        cloudId,
        mpType,
        subdomain,
        nfiversion,
      } = ctx.query;
      let selectedFilters = {
        sortBy,
        domain,
        channels,
        category,
        platform,
        keyword,
        tags,
        mpType,
        author,
        cloudId,
        cloud_account_id,
        nfiversion,
      };

      let tempHeaders = {
        'X-KONY-SORTBY': ctx.query.sortBy || 'popular',
        'X-KONY-CATEGORY': ctx.query.category || 'all',
        'X-KONY-PLATFORM-VERSION': ctx.query.platform || 'all',
        'X-KONY-NFI-VERSION': ctx.query.nfiversion || 'all',
        'X-KONY-KEYWORD': ctx.query.keyword || '',
      };

      if (keyword && !sortBy) {
        delete tempHeaders['X-KONY-SORTBY'];
      }

      if (category) {
        selectedFilters.category = Array.isArray(category) ? category : category.split(',');
        tempHeaders['X-KONY-CATEGORY'] = selectedFilters.category.join('&');
      }

      if (tags) {
        selectedFilters.tags = Array.isArray(tags) ? tags : tags.split(',');
        tempHeaders['X-KONY-TAG'] = selectedFilters.tags.join('&');
      }

      if (domain) {
        selectedFilters.subdomain = subdomain;
        tempHeaders['X-KONY-DOMAIN'] = ctx.query.domain;
        if (subdomain) {
          tempHeaders['X-KONY-SUBDOMAIN'] = ctx.query.subdomain;
        }
      }

      if (channels) {
        selectedFilters.channels = Array.isArray(channels) ? channels : channels.split(',');
        tempHeaders['X-KONY-CHANNEL'] = selectedFilters.channels.join('&');
      }

      if (author) {
        try {
          const decodedAuthor = Base64.decode(author);
          if (decodedAuthor) {
            tempHeaders['X-KONY-AUTHOR'] = decodedAuthor.split('::')[1] || decodedAuthor.split('::')[0];
          }
        } catch (error) {
          tempHeaders['X-KONY-AUTHOR'] = author;
        }
      }

      if (cloudId) {
        const state = ctx.store.getState();
        if (!state.marketplace.isLogin) {
          ctx.res.redirect(`/oauth/login?destination=/cloud/${cloudId}`);
        }
        tempHeaders['X-KONY-ACCOUNT-ID'] = ctx.query.cloudId;
        tempHeaders['X-KONY-MARKETPLACE-TYPE'] = mpType || 'private';
      }

      if (ctx.query.cloud_account_id || ctx.req?.cookies?.account_id) {
        const accountId = ctx.query.cloud_account_id || ctx.req?.cookies?.account_id;
        ctx.res.cookie('account_id', accountId);
        tempHeaders['X-KONY-ACCOUNT-ID'] = accountId;

        if (ctx.query?.useragent || ctx.req?.cookies?.useragent) {
          tempHeaders['X-KONY-MARKETPLACE-TYPE'] = 'all';
        }
      }

      if (ctx.query?.useragent || ctx.req?.cookies?.useragent) {
        if (ctx.query.platform || ctx.req?.cookies.platform) {
          tempHeaders['X-KONY-PLATFORM-VERSION'] = ctx.query.platform || ctx.req?.cookies.platform || 2352;
        } else {
          tempHeaders['X-KONY-PLATFORM-VERSION'] = 2352;
        }
        if (ctx.query.nfiversion || ctx.req?.cookies.nfiversion) {
          tempHeaders['X-KONY-NFI-VERSION'] = ctx.query.nfiversion || ctx.req?.cookies.nfiversion || 'all';
        } else {
          tempHeaders['X-KONY-NFI-VERSION'] = 'all';
        }
      }

      if (mpType) {
        tempHeaders['X-KONY-MARKETPLACE-TYPE'] = mpType || 'all';
      }

      ctx.store.dispatch({
        type: 'SET_SELECTED_FILTERS',
        payload: selectedFilters,
      });
      ctx.store.dispatch({ type: 'SET_HEADERS', payload: tempHeaders });
    }
  } else {
    const login = ctx.store.getState();
    if (login && ctx.pathname === '/auth/login') {
      setTimeout(() => {
        Router.push('/');
      }, 0);
    }
  }
}

if (process.browser) {
  const whoamiData = getCookie('mp_user_data') ? JSON.parse(Base64.decode(getCookie('mp_user_data'))) : false;

  const auth_token = getCookie('mp_refresh_token') || false;
  if (whoamiData && auth_token) {
    tempInstance.defaults.headers.common['X-Kony-Authorization'] = auth_token;
  }
}

export const urlRedirect = (path, query) => {
  let base = '';
  let urlPath = path;
  if (process.browser) {
    if (getCookie('useragent') === 'visualizer') {
      base = '/marketplace-viz';
    }

    if (urlPath === '/r' && _size(query) === 0) {
      urlPath = '/';
    }
    Router.replace({
      pathname: `${base}${urlPath}`,
      query,
    });
  }
};

export const getUrl = (path, query, isVizWeb) => {
  let base = '';
  if (process.browser) {
    if (getCookie('useragent') === 'visualizer') {
      base = '/marketplace-viz';
    }
  } else if (isVizWeb) {
    base = '/marketplace-viz';
  }
  if (query && query.length > 0) {
    return `${base}${path}?${query}`;
  }
  return `${base}${path}`;
};
export const instance = tempInstance;
