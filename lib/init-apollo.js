import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from 'apollo-boost';
import { withClientState } from 'apollo-link-state';
import getConfig from 'next/config';
import fetch from 'isomorphic-unfetch';
import { rehydrate } from './auth';

const {
  publicRuntimeConfig: { PUBLIC_API_URL },
} = getConfig();

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState, httpHeaders) {
  const fetchConfig = {};
  const cache = new InMemoryCache().restore(initialState || {});

  const rehydratedData = rehydrate();
  const stateLink = withClientState({
    cache,
    defaults: {
      searchedData: rehydratedData
        ? rehydratedData.ROOT_QUERY.searchedData
        : { __typename: 'SearchData', text: '' },
    },
    typeDefs: `
      type Mutation {
        setSearchedData(data: SearchDataInput)
      }
      type Query {
        searchedData: SearchData
      }
      type SearchData {
        text: String
        sourceText: String
        sourceUrl: String
      }
      input SearchDataInput {
        text: String
        sourceText: String
        sourceUrl: String
      }
    `,
    resolvers: {
      Mutation: {
        setSearchedData: (
          _,
          { data: { text, sourceText = '', sourceUrl = '' } },
          { cache }
        ) => {
          cache.writeData({
            data: {
              searchedData: {
                __typename: 'SearchData',
                text,
                sourceText,
                sourceUrl,
              },
            },
          });
          return null;
        },
      },
    },
  });

  if (httpHeaders && httpHeaders.cookie) {
    fetchConfig.headers = { cookie: httpHeaders.cookie };
  }
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from([
      stateLink,
      new HttpLink({
        uri: PUBLIC_API_URL,
        credentials: 'include', // Additional fetch() options like `credentials` or `headers`
        ...fetchConfig,
      }),
    ]),
    cache,
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
