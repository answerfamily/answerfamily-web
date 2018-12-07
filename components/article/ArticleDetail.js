import { Component } from 'react';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { produce } from 'immer';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import NewParagraph from './NewParagraph';
import ExistingParagraph from './ExistingParagraph';
import SourcesForm from './SourcesForm';
import SplitLayout from '../common/SplitLayout';

const articleFragment = gql`
  fragment articleDetail on Article {
    id
    text
    paragraphs {
      ...articleDetailParagraph
    }
    sources {
      ...articleSource
    }
  }
  ${SourcesForm.fragments.sources}
  ${ExistingParagraph.fragments.paragraph}
`;

const NEW_PARAGRAPH = gql`
  mutation($articleId: String!, $paragraph: ParagraphInput!) {
    addParagraphToArticle(articleId: $articleId, paragraph: $paragraph) {
      ...articleDetail
    }
  }
  ${articleFragment}
`;

const DELETE_PARAGRAPH = gql`
  mutation($paragraphId: String!) {
    deleteParagraph(paragraphId: $paragraphId) {
      ...articleDetail
    }
  }
  ${articleFragment}
`;

const EMPTY_PARAGRAPH = {
  text: '',
};

class NewParagraphEditor extends Component {
  state = {
    articleId: '',
    paragraph: EMPTY_PARAGRAPH,
    createParagraph() {},
  };

  handleSubmit = e => {
    e.preventDefault();
    const { articleId, createParagraph } = this.props;
    const { paragraph } = this.state;
    createParagraph({
      variables: {
        articleId,
        paragraph,
      },
    });
    this.setState(
      produce(state => {
        state.paragraph = EMPTY_PARAGRAPH;
      })
    );
  };

  handleParagraphTextChange = (_, text) => {
    this.setState(
      produce(({ paragraph }) => {
        paragraph.text = text;
      })
    );
  };

  render() {
    const { paragraph } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <NewParagraph
          text={paragraph.text}
          onTextChange={this.handleParagraphTextChange}
        />
        <button type="submit">新增段落</button>
      </form>
    );
  }
}

const NEW_SOURCE = gql`
  mutation($articleId: String!, $source: ArticleSourceInput!) {
    addSourceToArticle(articleId: $articleId, source: $source) {
      ...articleDetail
    }
  }
  ${articleFragment}
`;

const DELETE_SOURCE = gql`
  mutation($sourceId: ObjectId!) {
    deleteSource(sourceId: $sourceId) {
      ...articleDetail
    }
  }
  ${articleFragment}
`;

class ArticleDetail extends Component {
  static defaultProps = {
    createArticle() {},
  };

  static fragments = {
    article: articleFragment,
  };

  render() {
    const { article } = this.props;
    const paragraphs = article.paragraphs;

    return (
      <SplitLayout>
        <section className="article">
          <Mutation mutation={NEW_SOURCE}>
            {addSource => (
              <Mutation mutation={DELETE_SOURCE}>
                {deleteSource => (
                  <SourcesForm
                    sources={article.sources}
                    onAdd={source =>
                      addSource({
                        variables: { source, articleId: article.id },
                      })
                    }
                    onDelete={idx => {
                      const sourceId = article.sources[idx].id;
                      deleteSource({ variables: { sourceId } });
                    }}
                  />
                )}
              </Mutation>
            )}
          </Mutation>
          {article.text}
        </section>
        <section className="paragraph-panel">
          <div className="paragraphs">
            {paragraphs.map(paragraph => (
              <Mutation key={paragraph.id} mutation={DELETE_PARAGRAPH}>
                {(deleteParagraph, { loading }) => (
                  <ExistingParagraph
                    paragraph={paragraph}
                    loading={loading}
                    deleteParagraph={deleteParagraph}
                  />
                )}
              </Mutation>
            ))}
          </div>

          <Mutation mutation={NEW_PARAGRAPH}>
            {(createParagraph, { loading }) => (
              <NewParagraphEditor
                articleId={article.id}
                createParagraph={createParagraph}
                loading={loading}
              />
            )}
          </Mutation>
        </section>

        <style jsx>{`
          .paragraph-panel {
            background: ${blueGrey[50]};
          }

          .paragraphs {
            padding: 16px;
          }
        `}</style>
      </SplitLayout>
    );
  }
}

export default ArticleDetail;
