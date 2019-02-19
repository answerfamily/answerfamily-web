import React from 'react';
import { Query } from 'react-apollo';
import { Hidden } from '@material-ui/core';

import AppBar from '../components/common/AppBar';
import Layout from '../components/common/Layout';

import { SEARCHED_DATA } from '../components/common/ArticleSearchForm';

import AppBarTabs from '../components/search/AppBarTab';
import AppBarSearchForm from '../components/search/AppBarSearchForm';
import ParagraphSearch from '../components/search/ParagraphSearch';
import ArticleSearch from '../components/search/ArticleSearch';
import SubmitArticleDialog from '../components/search/SubmitArticleDialog';

class SearchPage extends React.Component {
  state = {
    currentTab: 'articles',
    isSubmitDialogOpen: false,
  };

  openDialog = () => {
    this.setState({ isSubmitDialogOpen: true });
  };

  handleTabChange = (event, tabValue) => {
    this.setState({ currentTab: tabValue });
  };

  handleDialogClose = () => {
    this.setState({ isSubmitDialogOpen: false });
  };

  render() {
    const { currentTab, isSubmitDialogOpen } = this.state;

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
                  onSubmit={this.openDialog}
                />
              ) : (
                <ParagraphSearch
                  text={searchedText}
                  onSubmit={this.openDialog}
                />
              )}

              <SubmitArticleDialog
                open={isSubmitDialogOpen}
                searchedData={data.searchedData}
                onClose={this.handleDialogClose}
              />
            </Layout>
          );
        }}
      </Query>
    );
  }
}

export default SearchPage;
