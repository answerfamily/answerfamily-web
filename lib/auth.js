// From: https://auth0.com/blog/nextjs-6-features-introduction/

import Cookie from 'js-cookie';
import Router from 'next/router';

export const setToken = (idToken, accessToken) => {
  if (!process.browser) {
    return;
  }
  Cookie.set('idToken', idToken);
  Cookie.set('accessToken', accessToken);
};

export const unsetToken = () => {
  if (!process.browser) {
    return;
  }
  Cookie.remove('idToken');
  Cookie.remove('accessToken');
};

const LOGIN_REDIRECT_KEY = 'LOGIN_REDIRECT';

export function setLoginRedirect() {
  localStorage.setItem(LOGIN_REDIRECT_KEY, location.pathname);
}

export function followLoginRedirect() {
  const path = localStorage.getItem(LOGIN_REDIRECT_KEY) || '/';
  localStorage.removeItem(LOGIN_REDIRECT_KEY);
  Router.push(path);
}

const STORE_HYDRATION_KEY = '__APOLLO_STATE__';

/**
 * Dehydrates Apollo client state to localStorage
 * @param {ApolloClient} client
 */
export function dehydrate(client) {
  const storeData = JSON.stringify(client.extract());
  localStorage.setItem(STORE_HYDRATION_KEY, storeData);
}

/**
 * Rehydrates Apollo client state from localStorage, clear out localStorage
 * @returns {object|null} the previously stored apollo state
 */
export function rehydrate() {
  if (!process.browser) return null;

  const storeStr = localStorage.getItem(STORE_HYDRATION_KEY);
  if (!storeStr) return null;
  localStorage.removeItem(STORE_HYDRATION_KEY);

  return JSON.parse(storeStr);
}
