import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import requireLogin from '../lib/require-login';
import ArticleForm from '../components/ArticleForm';
import Redirect from '../components/Redirect';

export const CREATE_ARTCILE = gql`
  mutation($article: ArticleInput) {
    createArticle(article: $article) {
      id
    }
  }
`;

function AddPage() {
  return (
    <Mutation mutation={CREATE_ARTCILE}>
      {(createArticle, { data, called, loading, error }) => {
        if (loading) {
          return <p>Loading...</p>;
        }
        if (called && data) {
          return <Redirect to={`/article/${data.createArticle.id}`} />;
        }
        if (error) {
          return <p>Error: {error}</p>;
        }
        return <ArticleForm loading={loading} createArticle={createArticle} />;
      }}
    </Mutation>
  );
}

export default requireLogin(AddPage);
