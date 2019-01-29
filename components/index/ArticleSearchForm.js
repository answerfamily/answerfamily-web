import { Component } from 'react';
import { Router } from '../../routes';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import cofactsClient from '../../lib/cofactsClient';

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
    saveSearchedData() {},
  };

  state = {
    isCheckingUrl: false,
  };

  handleSearch = e => {
    e.preventDefault();
    const searchString = e.target.searchedText.value;

    // if (searchString.length <= SEARCH_STRING_MAX_LEN) {
    //   Router.pushRoute(getSearchUrl(searchString));
    // } else {
    this.props.saveSearchedData({ text: searchString });
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
    <Mutation mutation={SET_SEARCH_DATA}>
      {search => (
        <ArticleSearchForm
          saveSearchedData={data => search({ variables: { data } })}
        />
      )}
    </Mutation>
  );
}

export default ArticleSearchFormContainer;
