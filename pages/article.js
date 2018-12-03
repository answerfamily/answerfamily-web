import { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import ArticleDetail from '../components/ArticleDetail';

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

  render() {
    const { id } = this.props;
    return (
      <Query query={GET_ARTICLE} variables={{ id: id }}>
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
