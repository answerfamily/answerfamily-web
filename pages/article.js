import { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import ArticleDetail from '../components/ArticleDetail';

export const ARTICLE_PAGE = gql`
  query($id: String!) {
    article(id: $id) {
      id
      text
      paragraphs {
        id
        text
        paragraphReplies {
          createdAt
          reply {
            id
            text
            createdAt
          }
        }
      }
      sources {
        url
        note
      }
    }
  }
`;

class ArticlePage extends Component {
  static getInitialProps({ query }) {
    return {
      id: query.id,
    };
  }

  render() {
    const { id } = this.props;
    return (
      <Query query={ARTICLE_PAGE} variables={{ id: id }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <p>Loading...</p>;
          }

          if (error) {
            return <p>Error: {error}</p>;
          }

          return <ArticleDetail article={data.article} />;
        }}
      </Query>
    );
  }
}

export default ArticlePage;
