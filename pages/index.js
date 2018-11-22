import { Component } from 'react';
import Router from 'next/router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

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
    const { tab } = this.state;

    return (
      <div>
        <Mutation mutation={SET_SEARCH_TEXT}>
          {search => (
            <ArticleSearchForm
              onSubmit={text => search({ variables: { text } })}
            />
          )}
        </Mutation>
        <Tabs onChange={this.handleTabChange} value={tab}>
          <Tab label="Paragraph Reply" />
          <Tab label="Paragraphs" />
        </Tabs>
        {tab === 0 && <ParagraphReplyList />}
        {tab === 1 && <ParagraphList />}
      </div>
    );
  }
}

export default Index;
