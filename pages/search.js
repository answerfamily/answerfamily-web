import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import ParagraphSearch from '../components/search/ParagraphSearch';
import Router from 'next/router';

const SEARCHED_DATA = gql`
  {
    searchedData @client {
      text
      sourceText
      sourceUrl
    }
  }
`;

class SearchPage extends React.Component {
  handleArticleSubmit = () => {
    Router.push('/submit-article');
  };

  render() {
    return (
      <Query query={SEARCHED_DATA}>
        {({ data, error, loading }) => {
          if (error) {
            return <p>{error}</p>;
          }

          return (
            <ParagraphSearch
              text={data.searchedData ? data.searchedData.text : ''}
              loading={loading}
              onSubmit={this.handleArticleSubmit}
            />
          );
        }}
      </Query>
    );
  }
}

export default SearchPage;
