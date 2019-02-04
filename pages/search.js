import React from 'react';
import { Query } from 'react-apollo';

import AppBarSearchForm from '../components/search/AppBarSearchForm';

import AppBar from '../components/common/AppBar';
import Layout from '../components/common/Layout';
import { SEARCHED_DATA } from '../components/common/ArticleSearchForm';
import ParagraphSearch from '../components/search/ParagraphSearch';
import Router from 'next/router';
import AppBarTabs from '../components/search/AppBarTab';

class SearchPage extends React.Component {
  state = {
    currentTab: 'articles',
  };

  handleArticleSubmit = () => {
    Router.push('/submit-article');
  };

  render() {
    const { currentTab } = this.props;

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
                <AppBarTabs value={currentTab} />
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
