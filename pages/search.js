import React from 'react';
import { Query } from 'react-apollo';

import AppBarSearchForm from '../components/search/AppBarSearchForm';

import AppBar from '../components/common/AppBar';
import Layout from '../components/common/Layout';
import { SEARCHED_DATA } from '../components/common/ArticleSearchForm';
import ParagraphSearch from '../components/search/ParagraphSearch';
import ArticleSearch from '../components/search/ArticleSearch';
import Router from 'next/router';
import AppBarTabs from '../components/search/AppBarTab';
import { Hidden } from '@material-ui/core';

class SearchPage extends React.Component {
  state = {
    currentTab: 'articles',
  };

  handleArticleSubmit = () => {
    Router.push('/submit-article');
  };

  handleTabChange = (event, tabValue) => {
    this.setState({ currentTab: tabValue });
  };

  render() {
    const { currentTab } = this.state;

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

          if (loading) {
            return (
              <Layout>
                <AppBar />
                <p>Loading...</p>
              </Layout>
            );
          }

          const searchedText = data.searchedData ? data.searchedData.text : '';

          return (
            <Layout>
              <AppBar>
                <AppBarTabs
                  value={currentTab}
                  onChange={this.handleTabChange}
                />
                <Hidden xsDown>
                  <AppBarSearchForm text={searchedText} />
                </Hidden>
              </AppBar>

              {currentTab === 'articles' ? (
                <ArticleSearch
                  searchedText={searchedText}
                  onSubmit={this.handleArticleSubmit}
                />
              ) : (
                <ParagraphSearch
                  text={searchedText}
                  onSubmit={this.handleArticleSubmit}
                />
              )}
            </Layout>
          );
        }}
      </Query>
    );
  }
}

export default SearchPage;
