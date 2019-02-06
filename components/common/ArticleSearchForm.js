import { Component } from 'react';
import { Router } from '../../routes';
import { Mutation, Query } from 'react-apollo';
import urlRegex from 'url-regex';
import gql from 'graphql-tag';

import HyperlinkActionDialog from './HyperlinkActionDialog';

import cofactsClient from '../../lib/cofactsClient';

const SEARCH_INPUT_NAME = 'searchedText';

export const SEARCHED_DATA = gql`
  {
    searchedData @client {
      text
      sourceText
      sourceUrl
    }
  }
`;

/**
 * @param {string} articleId - Cofacts article ID
 * @return {object} rumors-api Article object
 */
function getCofactsArticle(articleId) {
  return cofactsClient
    .query({
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
    })
    .then(({ data }) => data.GetArticle);
}

/**
 * @param {object} client - Apollo client for answerfamily-api
 * @param {string} url - the url to get urlFetchRecord (Hyperlink)
 * @returns {object} answerfamily-api UrlFetchRecord object
 */
function getHyperlink(client, url) {
  return client
    .query({
      query: gql`
        query($url: String!) {
          hyperlinks(inText: $url) {
            url
            title
            summary
            articleSources {
              ...hyperlinkArticleSource
            }
          }
        }

        ${HyperlinkActionDialog.fragments.hyperlinkArticleSource}
      `,
      variables: { url },
    })
    .then(({ data }) => data.hyperlinks[0]);
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
    defaultValue: '',
    client: {}, // From ApolloConsumer
    saveSearchedData() {},
    children() {}, // ({inputName, defaultValue, isFetchingUrl}) => ReactElem
  };

  state = {
    isFetchingUrl: false,
    hyperlinkInDialog: null,
  };

  componentDidMount() {
    if (this.form && this.form[SEARCH_INPUT_NAME]) {
      this.form[SEARCH_INPUT_NAME].focus();
    }
  }

  /**
   * @param {object} searchedData - client schema SearchDataInput
   */
  goToSearchPage = searchedData => {
    // if (searchString.length <= SEARCH_STRING_MAX_LEN) {
    //   Router.pushRoute(getSearchUrl(searchString));
    // } else {
    this.props.saveSearchedData(searchedData);
    Router.pushRoute('/search');
    // }
  };

  handleSearch = async e => {
    const { client } = this.props;

    e.preventDefault();
    const searchString = e.target.searchedText.value;

    // Cofacts integration:
    // If only cofacts article ID is found, extract its content via Cofacts API
    //
    const cofactsArticleIDMatches = searchString.match(
      /^https:\/\/cofacts.g0v.tw\/article\/(.+)$/
    );

    if (cofactsArticleIDMatches) {
      this.setState({ isFetchingUrl: true });
      const article = await getCofactsArticle(cofactsArticleIDMatches[1]);
      this.setState({ isFetchingUrl: false });

      return this.goToSearchPage({
        text: article.text,
        sourceUrl: searchString,
        sourceText: `Cofacts 訊息 (初次回報：${new Date(
          article.createdAt
        ).toLocaleString()})`,
      });
    }

    // searchString is an URL
    if (urlRegex({ exact: true }).test(searchString.trim())) {
      this.setState({ isFetchingUrl: true });
      const hyperlink = await getHyperlink(client, searchString.trim());
      this.setState({ isFetchingUrl: false });

      if (hyperlink && hyperlink.articleSources.length > 0) {
        // Multiple article sources found, display dialog for users to choose
        //
        this.setState({
          hyperlinkInDialog: hyperlink,
        });

        return;
      }

      // No article sources, directly go to search page
      //
      return this.goToSearchPage({
        text: hyperlink.summary,
        sourceUrl: searchString.trim(),
        sourceText: hyperlink.title,
      });
    }

    this.goToSearchPage({ text: searchString });
  };

  handleDialogClose = () => {
    this.setState({ hyperlinkInDialog: null });
  };

  render() {
    const { defaultValue, children } = this.props;
    const { hyperlinkInDialog, isFetchingUrl } = this.state;

    return (
      <>
        {hyperlinkInDialog && (
          <HyperlinkActionDialog
            open
            title={hyperlinkInDialog.title}
            summary={hyperlinkInDialog.summary}
            url={hyperlinkInDialog.url}
            articleSources={hyperlinkInDialog.articleSources}
            onClose={this.handleDialogClose}
          />
        )}

        <form
          onSubmit={this.handleSearch}
          ref={el => {
            this.form = el;
          }}
        >
          {children({
            inputName: SEARCH_INPUT_NAME,
            defaultValue,
            isFetchingUrl,
          })}
        </form>
      </>
    );
  }
}

function ArticleSearchFormContainer({ classes, children }) {
  return (
    <Query query={SEARCHED_DATA}>
      {({ data, client }) => {
        const searchedText =
          data && data.searchedData ? data.searchedData.text : undefined;
        return (
          <Mutation mutation={SET_SEARCH_DATA}>
            {search => (
              <ArticleSearchForm
                defaultValue={searchedText}
                client={client}
                classes={classes}
                saveSearchedData={data => search({ variables: { data } })}
              >
                {children}
              </ArticleSearchForm>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
}

export default ArticleSearchFormContainer;
