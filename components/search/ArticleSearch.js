import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { truncate, parseTag } from '../../lib/text';

const LIST_ARTICLES = gql`
  query listArticles($inText: String) {
    articles(filter: { inText: $inText, includeHighlight: true }) {
      id
      text
      _highlight
      paragraphs {
        paragraphReplies {
          id
        }
      }
    }
  }
`;

function Article({ article: { text, _highlight } }) {
  const title = truncate(text.split('\n', 1)[0], {
    wordCount: 50,
    moreElem: '⋯⋯',
  });

  return (
    <div>
      <h1>{title}</h1>
      <p>{parseTag(_highlight, { fromElem: 'HIGHLIGHT', toElem: 'mark' })}</p>
    </div>
  );
}

class ArticleSearch extends React.Component {
  static defaultProps = {
    searchedText: '',
    articles: [],
  };

  render() {
    const { searchedText, articles } = this.props;

    return (
      <div>
        <header>
          與「{truncate(searchedText, { wordCount: 10, moreElem: '⋯⋯' })}
          」相近的訊息有：
        </header>

        {articles.map(article => (
          <Article key={article.id} article={article} />
        ))}
      </div>
    );
  }
}

function ArticleSearchWrapper({ searchedText }) {
  return (
    <Query query={LIST_ARTICLES} variables={{ inText: searchedText }}>
      {({ data, error, loading }) => {
        if (error) {
          return <p>{error}</p>;
        }
        if (loading) {
          return <p>Loading...</p>;
        }
        return (
          <ArticleSearch searchedText={searchedText} articles={data.articles} />
        );
      }}
    </Query>
  );
}

export default ArticleSearchWrapper;
