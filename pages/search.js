import React from 'react';
import { Query } from 'react-apollo';

import AppBarSearchForm from '../components/search/AppBarSearchForm';

import AppBar from '../components/common/AppBar';
import Layout from '../components/common/Layout';
import { SEARCHED_DATA } from '../components/common/ArticleSearchForm';
import ParagraphSearch from '../components/search/ParagraphSearch';
import Router from 'next/router';

class SearchPage extends React.Component {
  handleArticleSubmit = () => {
    Router.push('/submit-article');
  };

  render() {
    return (
      <Query query={SEARCHED_DATA}>
        {({ data, error, loading }) => {
          if (error) {
            return (
              <Layout>
                <AppBar />
                <p>{error}</p>
              </Layout>
            );
          }

          const searchedText = data.searchedData ? data.searchedData.text : '';

          return (
            <Layout>
              <AppBar>
                <AppBarSearchForm text={searchedText} />
              </AppBar>

              <ParagraphSearch
                text={searchedText}
                loading={loading}
                onSubmit={this.handleArticleSubmit}
              />
            </Layout>
          );
        }}
      </Query>
    );
  }
}

export default SearchPage;
