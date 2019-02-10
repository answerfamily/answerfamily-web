import { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Layout from '../components/common/Layout';
import ArticleDetail from '../components/article/ArticleDetail';
import AppBar from '../components/common/AppBar';

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
      <Layout>
        <AppBar />
        <Query query={GET_ARTICLE} variables={{ id: id }}>
          {({ loading, error, data }) => {
            if (loading) {
              return <p>Loading...</p>;
            }

            if (error) {
              return <p>Error: {error.toString()}</p>;
            }

            return <ArticleDetail article={data.article} />;
          }}
        </Query>
      </Layout>
    );
  }
}

export default ArticlePage;
