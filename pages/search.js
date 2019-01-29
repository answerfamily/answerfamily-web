import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';

import cofactsClient from '../lib/cofactsClient';

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

const LOAD_COFACTS_ARTICLE = gql`
  query($id: String!) {
    GetArticle(id: $id) {
      text
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

        // // Cofacts integration:
        // // If only cofacts article ID is found, extract its content via Cofacts API
        // //
        // const cofactsArticleIDMatches = data.searchedText.match(
        //   /^https:\/\/cofacts.g0v.tw\/article\/(.+)$/
        // );
        // if (cofactsArticleIDMatches) {
        //   const articleId = cofactsArticleIDMatches[1];
        //   return (
        //     <Query
        //       query={LOAD_COFACTS_ARTICLE}
        //       variables={{ id: articleId }}
        //       client={cofactsClient}
        //     >
        //       {({ data, error, loading }) => {
        //         if (loading) {
        //           return <p>展開 Cofacts 文章中⋯⋯</p>;
        //         }

        //         if (error) {
        //           return <p>Error fetching Cofacts</p>;
        //         }

        //         return children({ text: data.GetArticle.text });
        //       }}
        //     </Query>
        //   );
        // }

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
