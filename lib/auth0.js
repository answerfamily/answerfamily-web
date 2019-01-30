import auth0 from 'auth0-js';
import getConfig from 'next/config';

import { unsetToken } from './auth';

const {
  publicRuntimeConfig: { PUBLIC_AUTH0_CLIENT_ID, PUBLIC_AUTH0_CLIENT_DOMAIN },
} = getConfig();

const getAuth0 = () => {
  return new auth0.WebAuth({
    clientID: PUBLIC_AUTH0_CLIENT_ID,
    domain: PUBLIC_AUTH0_CLIENT_DOMAIN,
  });
};

const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`;

const getOptions = () => {
  return {
    responseType: 'token id_token',
    redirectUri: `${getBaseUrl()}/signed-in`,
    scope: 'openid profile email',
  };
};

export const authorize = () => getAuth0().authorize(getOptions());
export const logout = () => {
  unsetToken();
  return getAuth0().logout({
    returnTo: getBaseUrl(),
    clientId: PUBLIC_AUTH0_CLIENT_ID,
  });
};
export const parseHash = callback => getAuth0().parseHash(callback);
