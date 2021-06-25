import request from 'request';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import url from 'url';
import qs from 'qs';
import { Base64 } from 'js-base64';
import { setCookie, removeCookie, getCookie } from '../../src/utils/cookies';
import { instance as axios } from '../../src/utils/initialize';
import { oauthConsumer, oauthEnv } from '../../src/config/settings';
import * as actionType from './actionTypes';
import {fetchBasecampUser} from './marketplace';

export const login = query => async dispatch => {
  const { action, destination } = query;

  const env = oauthEnv;
  let base = '';
  if (getCookie('useragent') === 'visualizer') {
    base = '/marketplace-viz';
  }
  const current_url = url.parse(window.location.href);
  const siteBaseURL = `${current_url.protocol}//${current_url.host}`;
  const oauth_callback = `${siteBaseURL}${base}/oauth/callback`;
  const oauth_request_url = `https://manage.${env}kony.com/oauth/request_token`;
  const oauth_access_url = `https://manage.${env}kony.com/oauth/access_token`;
  const authorize_url = `https://manage.${env}kony.com/oauth/authorize?oauth_token=`;
  const whoami_url = `https://api.${env}kony.com/api/v1_0/whoami`;
  const claims_url = `https://accounts.auth.${env}konycloud.com/login`;

  // Init OAuth lib.
  const oauth = OAuth({
    consumer: {
      key: oauthConsumer.key,
      secret: oauthConsumer.secret
    },
    method: 'POST',
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto
        .createHmac('sha1', key)
        .update(base_string)
        .digest('base64');
    }
  });

  // Step - 1
  if (action === 'login') {
    // Store Destination Url
    if (undefined === destination) {
      localStorage.setItem('login_destination', `${base}/`);
    } else {
      localStorage.setItem('login_destination', `${base}${destination}`);
    }
    // Prepare request token request.
    const request_data = {
      url: oauth_request_url,
      method: 'POST',
      data: {
        oauth_callback
      }
    };

    // Init request token request.
    request(
      {
        url: request_data.url,
        method: request_data.method,
        form: oauth.authorize(request_data)
      },
      (err, response, body) => {
        if (!err) {
          // Keep safe request token to get access token and resource request.
          const { oauth_token, oauth_token_secret } = qs.parse(response.body);
          localStorage.setItem('request_token', oauth_token);
          localStorage.setItem('request_token_secret', oauth_token_secret);

          // Redirect to authorize request token.
          window.location.href = `${authorize_url}${oauth_token}`;
        } else {
          console.log(err);
          return err;
        }
      }
    ); // End request for request token.
  }

  // Step - 2 Callback page. Collect WhoAmI & Claims token and create session.
  if (action === 'callback') {
    const request_token = localStorage.getItem('request_token');
    const request_token_secret = localStorage.getItem('request_token_secret');

    const access_data = {
      url: oauth_access_url,
      method: 'POST',
      data: {
        consumer_key: oauthConsumer.key,
        oauth_token: request_token
      }
    };

    // OAuth token.
    const token = {
      key: request_token,
      secret: request_token_secret
    };

    // Request for access token.
    request(
      {
        url: access_data.url,
        method: access_data.method,
        form: oauth.authorize(access_data, token)
      },
      (err, response) => {
        if (err) return err;

        const { oauth_token, oauth_token_secret } = qs.parse(response.body);

        // Prepare request data for OAuth signature.
        const whoami_data = {
          url: whoami_url,
          method: 'GET'
        };

        // OAuth token.
        const token = {
          key: oauth_token,
          secret: oauth_token_secret
        };

        // Request for WhoAmI data.
        request(
          {
            url: whoami_data.url,
            method: whoami_data.method,
            headers: oauth.toHeader(oauth.authorize(whoami_data, token))
          },
          (err, response) => {
            if (err) return err;

            const whoami_response = JSON.parse(response.body);
            const whoami_cookie = {
              first_name: whoami_response.first_name,
              last_name: whoami_response.last_name,
              primary_email: whoami_response.primary_email,
            };
            setCookie('mp_user_data', Base64.encode(JSON.stringify(whoami_cookie)));

            // Request for claims token. On success of WhoAmI, request to collect Claims token.
            request(
              {
                url: claims_url,
                method: 'POST',
                form: {
                  userid: whoami_response.primary_email,
                  whoami: response.request.headers.Authorization
                }
              },
              (err, response, body) => {
                if (err) return err;

                const { claims_token, refresh_token } = JSON.parse(response.body);
                setCookie('mp_claims_token', JSON.stringify(claims_token));
                setCookie('mp_refresh_token', refresh_token);
                localStorage.removeItem('request_token');
                localStorage.removeItem('request_token_secret');

                // fetchBasecampUser & postLoginCall .
                axios.get('api/v1_0/marketplace/basecamp/get/user-info', {
                     headers: { 'X-Kony-Authorization': refresh_token },
                     params: {
                      email: whoami_cookie.primary_email,
                     },
                   }).then(res => {
                     if(res.data.userList && res.data.userList.length > 0)
                        dispatch({
                         type: actionType.SET_BASECAMP_USER,
                         payload: res.data.userList[0]
                       });
                   }).catch ((err) =>{
                   console.log(err);
                 })

                const login_destination = localStorage.getItem('login_destination') || `${base}/`;

                axios
                  .get(`/api/v1_0/marketplace/post-login`, {
                    headers: { 'X-Kony-Authorization': refresh_token }
                  })
                  .then(res => {
                    if (res.data) {
                      const { user_info } = res.data.data;
                      if (user_info) {
                        setCookie('mp_user_id', user_info.userId);
                        setCookie('mp_user_info', user_info.privateClouds);
                        setCookie('mp_mod_menu', user_info.adminMenu);
                        setCookie('hike_admin_menu', user_info.hikeAdminMenu || []);
                        setCookie('mp_private_mod_menu', user_info.privateModeratorMenu);
                        dispatch({
                          type: actionType.SET_USER_ID,
                          payload: user_info.userId,
                        });
                        dispatch({
                          type: actionType.SET_CLOUD_ACCOUNTS,
                          payload: user_info.privateClouds,
                        });
                        dispatch({
                          type: actionType.SET_MP_MODERATOR_MENU,
                          payload: user_info.adminMenu,
                        });
                        dispatch({
                          type: actionType.SET_HIKE_ADMIN_MENU,
                          payload: user_info.hikeAdminMenu,
                        });
                        dispatch({
                          type: actionType.SET_PRIVATE_MODERATOR_MENU,
                          payload: user_info.privateModeratorMenu,
                        });
                      }
                    }

                    localStorage.removeItem('login_destination');
                    window.location.href = login_destination;
                  })
                  .catch(err => {
                    console.log(err);
                    const login_destination = localStorage.getItem('login_destination') || `${base}/`;
                    localStorage.removeItem('login_destination');
                    window.location.href = login_destination;
                  });

                // redirect url to same page from where OAuth dance starts.
              }
            ); // End Request for claims token.
          }
        ); // End request for WhoAmI data.
      }
    );
  } // End Callback.

  if (action === 'logout') {
    axios.get('oauth/logout').then(res => {
      return res.status;
    }).catch(err => {
      console.log(err)
    });
    axios
      .get(`https://api.${env}kony.com/api/v1_0/logout`,{
        headers:{
          "X-realm": "accounts-ui "
        }
      })
      .then(res => {
        removeCookie('mp_claims_token');
        removeCookie('mp_refresh_token');
        removeCookie('mp_user_data');
        removeCookie('mp_user_id');
        removeCookie('mp_user_info');
        removeCookie('mp_mod_menu');
        removeCookie('hike_admin_menu');
        removeCookie('mp_private_mod_menu');
        delete axios.defaults.headers.common['X-Kony-Authorization'];
        window.location.href = destination || '/';
      })
      .catch(err => {
        removeCookie('mp_claims_token');
        removeCookie('mp_refresh_token');
        removeCookie('mp_user_data');
        removeCookie('mp_mod_menu');
        removeCookie('hike_admin_menu');
        removeCookie('mp_private_mod_menu');
        removeCookie('mp_user_id');
        removeCookie('mp_user_info');
        delete axios.defaults.headers.common['X-Kony-Authorization'];
        window.location.href = destination || '/';
        return err;
      });
  }
};
