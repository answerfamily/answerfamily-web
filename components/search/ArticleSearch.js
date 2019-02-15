import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { withStyles, Typography } from '@material-ui/core';

import { Link } from '../../routes';
import { truncate, parseTag } from '../../lib/text';
import RequireLogin from '../common/RequireLogin';

const styles = theme => ({
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },

  article: {
    margin: `${theme.spacing.unit * 2}px 0`,
  },

  articleTitle: {
    textDecoration: 'none',
    '&:hover h6': {
      textDecoration: 'underline',
    },
  },
});

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
      sources {
        note
      }
    }
  }
`;

function Article({ article: { id, text, _highlight, sources }, classes }) {
  const title = truncate(text.split('\n', 1)[0], {
    wordCount: 50,
    moreElem: '⋯⋯',
  });

  const sourcesStr = `${sources[0] && sources[0].note} ${
    sources.length > 1 ? `等 ${sources.length} 個來源` : ''
  }`;

  return (
    <article className={classes.article}>
      <Link route={`/article/${id}`}>
        <a className={classes.articleTitle}>
          <Typography variant="h6">{title}</Typography>
          <Typography>{sourcesStr}</Typography>
        </a>
      </Link>
      <Typography tag="p" variant="body2">
        {parseTag(_highlight, { fromElem: 'HIGHLIGHT', toElem: 'mark' })}
      </Typography>
    </article>
  );
}

class ArticleSearch extends React.Component {
  static defaultProps = {
    searchedText: '',
    articles: [],
    onSubmit() {},
  };

  render() {
    const { searchedText, articles, classes, onSubmit } = this.props;

    return (
      <div className={classes.container}>
        <Typography tag="header" variant="subtitle1">
          與「{truncate(searchedText, { wordCount: 10, moreElem: '⋯⋯' })}
          」相近的訊息有：
        </Typography>

        {articles.map(article => (
          <Article key={article.id} article={article} classes={classes} />
        ))}

        <RequireLogin>
          {({ me, authorize }) => {
            if (me) {
              return (
                <button type="button" onClick={onSubmit}>
                  送出文章到資料庫
                </button>
              );
            }

            return (
              <p>
                請先{' '}
                <button type="button" onClick={authorize}>
                  登入
                </button>{' '}
                才能送出文章
              </p>
            );
          }}
        </RequireLogin>
      </div>
    );
  }
}

function ArticleSearchWrapper({ searchedText, classes, ...props }) {
  return (
    <Query query={LIST_ARTICLES} variables={{ inText: searchedText }}>
      {({ data, error, loading }) => {
        if (error) {
          return <p>{error.toString()}</p>;
        }
        if (loading) {
          return <p>Loading...</p>;
        }
        return (
          <ArticleSearch
            searchedText={searchedText}
            articles={data.articles}
            classes={classes}
            {...props}
          />
        );
      }}
    </Query>
  );
}

export default withStyles(styles)(ArticleSearchWrapper);
