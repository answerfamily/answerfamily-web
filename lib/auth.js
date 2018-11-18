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
  Router.push(path);
}
