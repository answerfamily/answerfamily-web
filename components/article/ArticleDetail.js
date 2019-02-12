import { Component } from 'react';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { produce } from 'immer';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import NewParagraph from './NewParagraph';
import ExistingParagraph from './ExistingParagraph';
import SourcesForm from './SourcesForm';
import Hyperlink from './Hyperlink';
import HyperlinkActionDialog from '../common/HyperlinkActionDialog';

import { mark, nl2br, linkify } from '../../lib/text';
import ArticleParagraphSections from '../common/ArticleParagraphSections';

const articleFragment = gql`
  fragment articleDetail on Article {
    id
    text
    hyperlinks {
      ...hyperlink
    }
    paragraphs {
      ...articleDetailParagraph
    }
    sources {
      ...articleSource
    }
  }
  ${SourcesForm.fragments.sources}
  ${ExistingParagraph.fragments.paragraph}
  ${Hyperlink.fragments.hyperlink}
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

  state = {
    searchedText: '',
    hyperlinkInDialog: null,
  };

  static fragments = {
    article: articleFragment,
  };

  handleHighlightClick = e => {
    this.setState({
      searchedText: e.target.innerText,
    });
  };

  handleUrlClick = e => {
    const targetHref = e.target.href;
    if (!targetHref) return;

    const hyperlink = this.props.article.hyperlinks.find(
      hyperlink => hyperlink && hyperlink.url === targetHref
    );
    if (!hyperlink) return;

    e.preventDefault();
    this.setState({
      hyperlinkInDialog: hyperlink,
    });
  };

  handleUrlDialogClose = () => {
    this.setState({
      hyperlinkInDialog: null,
    });
  };

  renderSourceForm = () => {
    const { article } = this.props;

    return (
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
    );
  };

  renderHyperlinks = () => {
    const { article } = this.props;

    return (
      article.hyperlinks.length > 0 && (
        <footer className="hyperlinks">
          {article.hyperlinks
            .filter(h => h)
            .map((hyperlink, idx) => (
              <Hyperlink key={idx} hyperlink={hyperlink} showDialogOnClick />
            ))}
        </footer>
      )
    );
  };

  renderArticle = ({ text, highlights }) => {
    const { searchedText } = this.state;

    return (
      <article>
        {nl2br(
          linkify(
            mark(
              mark(text, {
                stringsToMatch: highlights,
                props: {
                  onClick: this.handleHighlightClick,
                },
              }),
              {
                stringsToMatch: [searchedText],
                props: {
                  className: 'is-searched',
                },
              }
            ),
            { props: { onClick: this.handleUrlClick } }
          )
        )}
      </article>
    );
  };

  renderParagraphs = ({ paragraphs, style }) => {
    const { searchedText } = this.state;
    return (
      <section style={style}>
        {paragraphs.map(paragraph => (
          <Mutation key={paragraph.id} mutation={DELETE_PARAGRAPH}>
            {(deleteParagraph, { loading }) => (
              <ExistingParagraph
                paragraph={paragraph}
                loading={loading}
                deleteParagraph={deleteParagraph}
                highlightedText={searchedText}
              />
            )}
          </Mutation>
        ))}
      </section>
    );
  };

  render() {
    const { hyperlinkInDialog } = this.state;
    const { article } = this.props;

    if (!article) return <p>No such article</p>; // No such article

    return (
      <>
        {hyperlinkInDialog && (
          <HyperlinkActionDialog
            title={hyperlinkInDialog.title}
            url={hyperlinkInDialog.url}
            summary={hyperlinkInDialog.summary}
            articleSources={hyperlinkInDialog.articleSources}
            open
            onClose={this.handleUrlDialogClose}
          />
        )}

        {this.renderSourceForm()}

        <ArticleParagraphSections
          article={article.text}
          paragraphs={article.paragraphs}
          footerContentRenderer={this.renderHyperlinks}
          articleRenderer={this.renderArticle}
          paragraphsRenderer={this.renderParagraphs}
        />
        <section className="paragraph-panel">
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
          .hyperlinks {
            display: flex;
            flex-flow: row wrap;
          }

          .paragraph-panel {
            background: ${blueGrey[50]};
          }

          .paragraphs {
            padding: 16px;
          }

          article :global(mark.is-searched) {
            background: orange;
          }
        `}</style>
      </>
    );
  }
}

export default ArticleDetail;
