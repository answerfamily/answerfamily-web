import { Component } from 'react';
import { Router } from '../../routes';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { getSearchUrl } from '../../lib/searchUtil';

const SEARCH_STRING_MAX_LEN = 1000;

const SET_SEARCH_TEXT = gql`
  mutation($text: String!) {
    setSearchedText(text: $text) @client
  }
`;

/**
 * The form either performs onSubmit
 */
class ArticleSearchForm extends Component {
  static defaultProps = {
    saveSearchedText() {},
  };

  handleSearch = e => {
    e.preventDefault();
    const searchString = e.target.searchedText.value;

    if (searchString.length <= SEARCH_STRING_MAX_LEN) {
      Router.pushRoute(getSearchUrl(searchString));
    } else {
      this.props.saveSearchedText(searchString);
      Router.pushRoute('/search');
    }
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
    <Mutation mutation={SET_SEARCH_TEXT}>
      {search => (
        <ArticleSearchForm
          saveSearchedText={text => search({ variables: { text } })}
        />
      )}
    </Mutation>
  );
}

export default ArticleSearchFormContainer;
