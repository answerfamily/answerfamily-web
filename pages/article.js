import { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Layout from '../components/common/Layout';
import ArticleDetail from '../components/article/ArticleDetail';
import SelectedTextAppBar from '../components/article/SelectedTextAppBar';
import AppBar from '../components/common/AppBar';
import RequireLogin from '../components/common/RequireLogin';

const NEW_PARAGRAPH = gql`
  mutation($articleId: String!, $paragraph: ParagraphInput!) {
    addParagraphToArticle(articleId: $articleId, paragraph: $paragraph) {
      ...articleDetail
    }
  }
  ${ArticleDetail.fragments.article}
`;

export const GET_ARTICLE = gql`
  query($id: String!) {
    article(id: $id) {
      ...articleDetail
    }
  }
  ${ArticleDetail.fragments.article}
`;

class ArticlePage extends Component {
  static getInitialProps({ query }) {
    return {
      id: query.id,
    };
  }

  state = {
    selectedText: '',
  };

  handleTextSelect = selectedText => {
    this.setState({ selectedText });
  };

  render() {
    const { id } = this.props;
    const { selectedText } = this.state;

    return (
      <Layout>
        <AppBar />

        <RequireLogin>
          {({ me }) =>
            me &&
            selectedText && (
              <Mutation mutation={NEW_PARAGRAPH}>
                {(createParagraph, { loading }) => (
                  <SelectedTextAppBar
                    loading={loading}
                    selectedText={selectedText}
                    onParagraphSubmit={() =>
                      createParagraph({
                        variables: {
                          articleId: id,
                          paragraph: { text: selectedText },
                        },
                      })
                    }
                  />
                )}
              </Mutation>
            )
          }
        </RequireLogin>

        <Query query={GET_ARTICLE} variables={{ id: id }}>
          {({ loading, error, data }) => {
            if (loading) {
              return <p>Loading...</p>;
            }

            if (error) {
              return <p>Error: {error.toString()}</p>;
            }

            return (
              <ArticleDetail
                article={data.article}
                onTextSelect={this.handleTextSelect}
              />
            );
          }}
        </Query>
      </Layout>
    );
  }
}

export default ArticlePage;
