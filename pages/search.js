import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';

import ParagraphSearch from '../components/ParagraphSearch';
import Redirect from '../components/Redirect';

export const CREATE_ARTCILE = gql`
  mutation($article: ArticleInput) {
    createArticle(article: $article) {
      id
    }
  }
`;

const PARAGRAPH_SEARCH = gql`
  {
    searchedText @client
  }
`;

function SearchPage() {
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
        return (
          <Query query={PARAGRAPH_SEARCH}>
            {({ data, error }) => {
              if (error) {
                return <p>{error}</p>;
              }
              return (
                <ParagraphSearch
                  text={data.searchedText}
                  loading={loading}
                  onSubmit={article =>
                    createArticle({ variables: { article } })
                  }
                />
              );
            }}
          </Query>
        );
      }}
    </Mutation>
  );
}

export default SearchPage;
