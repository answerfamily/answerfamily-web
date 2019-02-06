import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from 'apollo-boost';
import getConfig from 'next/config';
import fetch from 'isomorphic-unfetch';
import getClientStateLink from './clientState';

const {
  publicRuntimeConfig: { PUBLIC_API_URL },
} = getConfig();

export let apolloClient = null;

function create(initialState, httpHeaders) {
  const fetchConfig = {};

  // Polyfill fetch() on the server (used by apollo-client)
  // https://github.com/apollographql/apollo-client/issues/3578
  if (!process.browser) {
    fetchConfig.fetch = fetch;
  }
  const cache = new InMemoryCache().restore(initialState);

  if (httpHeaders && httpHeaders.cookie) {
    fetchConfig.headers = { cookie: httpHeaders.cookie };
  }
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from([
      getClientStateLink(cache),
      new HttpLink({
        uri: PUBLIC_API_URL,
        credentials: 'include', // Additional fetch() options like `credentials` or `headers`
        ...fetchConfig,
      }),
    ]),
    cache,
  });
}

function initApollo(initialState, httpHeaders) {
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

export default initApollo;
