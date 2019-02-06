import gql from 'graphql-tag';
import { withClientState } from 'apollo-link-state';

const STORE_HYDRATION_KEY = '__APOLLO_STATE__';

const DEHYDRATE_QUERY = gql`
  query dehydrate {
    searchedData @client {
      __typename
      text
      sourceText
      sourceUrl
    }
  }
`;

const DEFAULTS = {
  searchedData: {
    __typename: 'SearchData',
    text: '',
    sourceText: '',
    sourceUrl: '',
  },
};

/**
 * Dehydrates Apollo client state to localStorage
 * @param {ApolloClient} client
 */
export async function dehydrate(client) {
  const { data } = await client.query({ query: DEHYDRATE_QUERY });
  const storeData = JSON.stringify(data);
  localStorage.setItem(STORE_HYDRATION_KEY, storeData);
}

/**
 * Rehydrates Apollo client state from localStorage, clear out localStorage
 * @returns {object|null} the previously stored apollo state
 */
export function rehydrate() {
  if (!process.browser) return null;

  const storeStr = localStorage.getItem(STORE_HYDRATION_KEY);
  if (!storeStr) return DEFAULTS;
  localStorage.removeItem(STORE_HYDRATION_KEY);

  return { ...DEFAULTS, ...JSON.parse(storeStr) };
}

function getClientStateLink(cache) {
  return withClientState({
    cache,
    defaults: rehydrate(),
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
}

export default getClientStateLink;
