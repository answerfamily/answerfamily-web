import gql from 'graphql-tag';
import Card from '@material-ui/core/Card';
import { Query } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';

import { Link } from '../../routes';

const LIST_ARTICLES = gql`
  {
    articles {
      id
      text
      createdAt
    }
  }
`;

const ArticleBubble = withStyles({
  root: {
    padding: 8,
    margin: '16px 8px',
  },
})(Card);

function Article({ article }) {
  return (
    <Link route="article" params={{ id: article.id }}>
      <a>
        <ArticleBubble>{article.text}</ArticleBubble>
        <style jsx>{`
          a {
            color: rgba(0, 0, 0, 0.8);
            text-decoration: none;
          }
        `}</style>
      </a>
    </Link>
  );
}

function ArticleList() {
  return (
    <Query query={LIST_ARTICLES}>
      {({ loading, data, error }) => {
        if (error) {
          return <p>Error {error}</p>;
        }

        if (loading) {
          return <p>Loading</p>;
        }

        return (
          <section>
            {data.articles.map(article => (
              <Article key={article.id} article={article} />
            ))}
          </section>
        );
      }}
    </Query>
  );
}

export default ArticleList;
