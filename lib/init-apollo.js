import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import getConfig from 'next/config';
import fetch from 'isomorphic-unfetch';

const {
  publicRuntimeConfig: { PUBLIC_API_URL },
} = getConfig();

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState, httpHeaders) {
  const linkConfig = {};
  if (httpHeaders && httpHeaders.cookie) {
    linkConfig.headers = { cookie: httpHeaders.cookie };
  }
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: new HttpLink({
      uri: PUBLIC_API_URL,
      credentials: 'include', // Additional fetch() options like `credentials` or `headers`
      ...linkConfig,
    }),
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

export default function initApollo(initialState, httpHeaders) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, httpHeaders);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
