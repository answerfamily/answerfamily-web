import { Component } from 'react';
import Router from 'next/router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withTheme } from '@material-ui/core/styles';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import AppBar from '../components/AppBar';
import ParagraphList from '../components/ParagraphList';
import ParagraphReplyList from '../components/ParagraphReplyList';

const SET_SEARCH_TEXT = gql`
  mutation($text: String!) {
    setSearchedText(text: $text) @client
  }
`;

class ArticleSearchForm extends Component {
  static defaultProps = {
    onSubmit() {},
  };

  handleSearch = e => {
    e.preventDefault();
    this.props.onSubmit(e.target.searchedText.value);
    Router.push('/search');
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

class Index extends Component {
  state = {
    tab: 0,
  };

  handleTabChange = (e, tab) => {
    this.setState({ tab });
  };

  render() {
    const { theme } = this.props;
    const { tab } = this.state;

    return (
      <div>
        <AppBar position="fixed" />
        <header className="jumbotron">
          <Mutation mutation={SET_SEARCH_TEXT}>
            {search => (
              <ArticleSearchForm
                onSubmit={text => search({ variables: { text } })}
              />
            )}
          </Mutation>
        </header>
        <Tabs onChange={this.handleTabChange} value={tab}>
          <Tab label="Paragraph Reply" />
          <Tab label="Paragraphs" />
        </Tabs>
        {tab === 0 && <ParagraphReplyList />}
        {tab === 1 && <ParagraphList />}

        <style jsx>{`
          .jumbotron {
            position: relative;
            z-index: ${theme.zIndex.appBar + 1}; /* Higher than AppBar */
            background: #fff;
            padding: 20px;
          }
        `}</style>
      </div>
    );
  }
}

export default withTheme()(Index);
