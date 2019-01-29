import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';

import ParagraphSearch from '../components/search/ParagraphSearch';
import Redirect from '../components/common/Redirect';

export const CREATE_ARTCILE = gql`
  mutation($article: ArticleInput) {
    createArticle(article: $article) {
      id
    }
  }
`;

const SEARCHED_DATA = gql`
  {
    searchedData @client {
      text
      sourceText
      sourceUrl
    }
  }
`;

function ParagraphSearchDataContainer({ children }) {
  return (
    <Query query={SEARCHED_DATA}>
      {({ data, error }) => {
        if (error) {
          return <p>{error}</p>;
        }

        return children({
          text: data.searchedData ? data.searchedData.text : '',
        });
      }}
    </Query>
  );
}

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
          <ParagraphSearchDataContainer>
            {({ text }) => (
              <ParagraphSearch
                text={text}
                loading={loading}
                onSubmit={article => createArticle({ variables: { article } })}
              />
            )}
          </ParagraphSearchDataContainer>
        );
      }}
    </Mutation>
  );
}

export default SearchPage;
