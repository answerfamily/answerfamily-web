import { Component } from 'react';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { produce } from 'immer';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import NewParagraph from './NewParagraph';
import ExistingParagraph from './ExistingParagraph';
import SourcesForm from './SourcesForm';
import Hyperlink from './Hyperlink';
import SplitLayout from '../common/SplitLayout';
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

  handleTextSearch = e => {
    this.setState({
      searchedText: e.target.value,
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

  render() {
    const { searchedText, hyperlinkInDialog } = this.state;
    const { article } = this.props;

    if (!article) return <div>No such article</div>; // No such article

    const paragraphs = article.paragraphs;
    const paragraphTexts = paragraphs.map(p => p.text);
    const filteredParagraphs = paragraphs.filter(p =>
      p.text.includes(searchedText)
    );

    return (
      <ArticleParagraphSections
        article={article.text}
        paragraphs={article.paragraphs}
      />
    );

    // return (
    //   <SplitLayout>
    //     {hyperlinkInDialog && (
    //       <HyperlinkActionDialog
    //         title={hyperlinkInDialog.title}
    //         url={hyperlinkInDialog.url}
    //         summary={hyperlinkInDialog.summary}
    //         articleSources={hyperlinkInDialog.articleSources}
    //         open
    //         onClose={this.handleUrlDialogClose}
    //       />
    //     )}
    //     <section className="article">
    //       <Mutation mutation={NEW_SOURCE}>
    //         {addSource => (
    //           <Mutation mutation={DELETE_SOURCE}>
    //             {deleteSource => (
    //               <SourcesForm
    //                 sources={article.sources}
    //                 onAdd={source =>
    //                   addSource({
    //                     variables: { source, articleId: article.id },
    //                   })
    //                 }
    //                 onDelete={idx => {
    //                   const sourceId = article.sources[idx].id;
    //                   deleteSource({ variables: { sourceId } });
    //                 }}
    //               />
    //             )}
    //           </Mutation>
    //         )}
    //       </Mutation>
    //       <article>
    //         {nl2br(
    //           linkify(
    //             mark(
    //               mark(article.text, {
    //                 stringsToMatch: paragraphTexts,
    //                 props: {
    //                   onClick: this.handleHighlightClick,
    //                 },
    //               }),
    //               {
    //                 stringsToMatch: [searchedText],
    //                 props: {
    //                   className: 'is-searched',
    //                 },
    //               }
    //             ),
    //             { props: { onClick: this.handleUrlClick } }
    //           )
    //         )}
    //       </article>
    //       {article.hyperlinks.length > 0 && (
    //         <footer className="hyperlinks">
    //           {article.hyperlinks
    //             .filter(h => h)
    //             .map((hyperlink, idx) => (
    //               <Hyperlink
    //                 key={idx}
    //                 hyperlink={hyperlink}
    //                 showDialogOnClick
    //               />
    //             ))}
    //         </footer>
    //       )}
    //     </section>
    //     <section className="paragraph-panel">
    //       <input
    //         type="search"
    //         value={searchedText}
    //         onChange={this.handleTextSearch}
    //       />

    //       <div className="paragraphs">
    //         {filteredParagraphs.map(paragraph => (
    //           <Mutation key={paragraph.id} mutation={DELETE_PARAGRAPH}>
    //             {(deleteParagraph, { loading }) => (
    //               <ExistingParagraph
    //                 paragraph={paragraph}
    //                 loading={loading}
    //                 deleteParagraph={deleteParagraph}
    //                 highlightedText={searchedText}
    //               />
    //             )}
    //           </Mutation>
    //         ))}
    //       </div>

    //       <Mutation mutation={NEW_PARAGRAPH}>
    //         {(createParagraph, { loading }) => (
    //           <NewParagraphEditor
    //             articleId={article.id}
    //             createParagraph={createParagraph}
    //             loading={loading}
    //           />
    //         )}
    //       </Mutation>
    //     </section>

    //     <style jsx>{`
    //       .hyperlinks {
    //         display: flex;
    //         flex-flow: row wrap;
    //       }

    //       .paragraph-panel {
    //         background: ${blueGrey[50]};
    //       }

    //       .paragraphs {
    //         padding: 16px;
    //       }

    //       article :global(mark.is-searched) {
    //         background: orange;
    //       }
    //     `}</style>
    //   </SplitLayout>
    // );
  }
}

export default ArticleDetail;
