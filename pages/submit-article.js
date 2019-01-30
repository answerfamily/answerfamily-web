import React from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';

import RequireLogin from '../components/common/RequireLogin';
import Redirect from '../components/common/Redirect';
import AppBar from '../components/common/AppBar';
import SourcesForm from '../components/article/SourcesForm';

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

class ArticleSubmissionForm extends React.Component {
  static defaultProps = {
    sourceText: null,
    sourceUrl: null,
    text: '',
  };

  constructor(props) {
    super(props);

    const sources = [];
    if (props.sourceUrl) {
      sources.push({
        note: props.sourceText || '',
        url: props.sourceUrl,
      });
    }

    this.state = { sources };
  }

  handleSubmit = evt => {
    const form = evt.target;
    const articleInput = {
      text: form.text.value,
      sources: this.state.sources,
    };

    this.props.onSubmit(articleInput);
  };

  handleSourceAdd = source => {
    this.setState(({ sources }) => ({ sources: sources.concat(source) }));
  };

  handleSourceDelete = idxToDelete => {
    this.setState(({ sources }) => ({
      sources: sources.filter((_, idx) => idx === idxToDelete),
    }));
  };

  render() {
    const { text } = this.props;
    const { sources } = this.state;

    return (
      <div className="page">
        <AppBar />
        <SourcesForm
          sources={sources}
          onAdd={this.handleSourceAdd}
          onDelete={this.handleSourceDelete}
        />
        <form onSubmit={this.handleSubmit}>
          <h1>論述內容</h1>
          <textarea name="text" defaultValue={text} />
          <button type="submit">把論述存進公開資料庫</button>
        </form>

        <style jsx>{`
          .page {
            min-height: 100vh;
            display: flex;
            flex-flow: column;
          }

          form {
            flex: 1;
            display: flex;
            flex-flow: column;
          }

          textarea {
            flex: 1;
          }
        `}</style>
      </div>
    );
  }
}

function ParagraphSearchDataContainer({ children }) {
  return (
    <Query query={SEARCHED_DATA}>
      {({ data, error }) => {
        if (error) {
          return <p>{error}</p>;
        }

        return children(data.searchedData || {});
      }}
    </Query>
  );
}

function SubmitArticlePage() {
  return (
    <RequireLogin>
      {({ me }) => {
        if (!me) {
          return <Redirect to="/" />;
        }

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
                return <p>Error: {error.toString()}</p>;
              }
              return (
                <ParagraphSearchDataContainer>
                  {({ text, sourceText, sourceUrl }) => (
                    <ArticleSubmissionForm
                      text={text}
                      sourceText={sourceText}
                      sourceUrl={sourceUrl}
                      loading={loading}
                      onSubmit={article =>
                        createArticle({ variables: { article } })
                      }
                    />
                  )}
                </ParagraphSearchDataContainer>
              );
            }}
          </Mutation>
        );
      }}
    </RequireLogin>
  );
}

export default SubmitArticlePage;
