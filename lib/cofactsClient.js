// We are just using apollo-boost ApolloClient for here
// https://www.apollographql.com/docs/react/essentials/get-started.html

// eslint-disable-next-line import/no-named-as-default
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const cofactsClient = new ApolloClient({
  uri: 'https://cofacts-api.g0v.tw/graphql',
});

export default cofactsClient;

if (process.browser) {
  window.cofactsClient = cofactsClient;
  window.ggql = gql;
}
