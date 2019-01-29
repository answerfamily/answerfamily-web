import { Component } from 'react';
import { Router } from '../../routes';
import { Mutation, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import cofactsClient from '../../lib/cofactsClient';

function getCofactsArticle(articleId) {
  return cofactsClient.query({
    query: gql`
      query($id: String!) {
        GetArticle(id: $id) {
          text
          createdAt
        }
      }
    `,
    variables: {
      id: articleId,
    },
  });
}

// import { getSearchUrl } from '../../lib/searchUtil';

// const SEARCH_STRING_MAX_LEN = 1000;

const SET_SEARCH_DATA = gql`
  mutation($data: SearchDataInput) {
    setSearchedData(data: $data) @client
  }
`;

/**
 * The form either performs onSubmit
 */
class ArticleSearchForm extends Component {
  static defaultProps = {
    client: {}, // From ApolloConsumer
    saveSearchedData() {},
  };

  state = {
    isFetchingUrl: false,
  };

  handleSearch = async e => {
    e.preventDefault();
    const searchString = e.target.searchedText.value;

    const searchedData = {};

    // Cofacts integration:
    // If only cofacts article ID is found, extract its content via Cofacts API
    //
    const cofactsArticleIDMatches = searchString.match(
      /^https:\/\/cofacts.g0v.tw\/article\/(.+)$/
    );

    if (cofactsArticleIDMatches) {
      this.setState({ isFetchingUrl: true });

      const {
        data: { GetArticle },
      } = await getCofactsArticle(cofactsArticleIDMatches[1]);
      searchedData.text = GetArticle.text;
      searchedData.sourceUrl = searchString;
      searchedData.sourceText = `Cofacts 訊息 (初次回報：${new Date(
        GetArticle.createdAt
      ).toLocaleString()})`;
    } else {
      searchedData.text = searchString;
    }

    // if (searchString.length <= SEARCH_STRING_MAX_LEN) {
    //   Router.pushRoute(getSearchUrl(searchString));
    // } else {
    this.setState({ isFetchingUrl: false });
    this.props.saveSearchedData(searchedData);
    Router.pushRoute('/search');
    // }
  };

  render() {
    return (
      <form onSubmit={this.handleSearch}>
        <textarea name="searchedText" />
        <button type="submit">看說法</button>
      </form>
    );
  }
}

function ArticleSearchFormContainer() {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation mutation={SET_SEARCH_DATA}>
          {search => (
            <ArticleSearchForm
              client={client}
              saveSearchedData={data => search({ variables: { data } })}
            />
          )}
        </Mutation>
      )}
    </ApolloConsumer>
  );
}

export default ArticleSearchFormContainer;
