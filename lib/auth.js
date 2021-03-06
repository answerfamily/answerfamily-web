// From: https://auth0.com/blog/nextjs-6-features-introduction/

import Cookie from 'js-cookie';
import Router from 'next/router';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { PUBLIC_COOKIE_DOMAIN },
} = getConfig();

export const setToken = (idToken, accessToken) => {
  if (!process.browser) {
    return;
  }
  Cookie.set('idToken', idToken, { domain: PUBLIC_COOKIE_DOMAIN });
  Cookie.set('accessToken', accessToken, { domain: PUBLIC_COOKIE_DOMAIN });
};

export const unsetToken = () => {
  if (!process.browser) {
    return;
  }
  Cookie.remove('idToken', { domain: PUBLIC_COOKIE_DOMAIN });
  Cookie.remove('accessToken', { domain: PUBLIC_COOKIE_DOMAIN });
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
