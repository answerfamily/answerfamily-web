import { Component, PureComponent } from 'react';
import blueGrey from '@material-ui/core/colors/blueGrey';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import ExistingParagraph from './ExistingParagraph';
import SourcesForm from './SourcesForm';
import Hyperlink from './Hyperlink';
import HyperlinkActionDialog from '../common/HyperlinkActionDialog';

import { mark, nl2br, linkify } from '../../lib/text';
import ArticleParagraphSections from '../common/ArticleParagraphSections';
import { Typography, withStyles } from '@material-ui/core';
import { orange, yellow } from '@material-ui/core/colors';

const styles = theme => ({
  header: {
    ...theme.mixins.gutters(),
    marginBottom: theme.spacing.unit * 2,
    '& h6': {
      color: theme.palette.text.secondary,
    },
  },
  hyperlinks: {
    display: 'flex',
    flexFlow: 'row wrap',
  },

  paragraphPanel: {
    background: blueGrey[50],
  },

  article: {
    '& mark': {
      background: yellow[500],
      cursor: 'pointer',
    },

    // https://material-ui.com/customization/overrides/#use-rulename-to-reference-a-local-rule-within-the-same-style-sheet
    '& mark$isSearched': {
      background: orange[500],
    },
  },

  isSearched: {},

  paragraphs: {
    padding: theme.spacing.unit * 2,
  },
});

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

const DELETE_PARAGRAPH = gql`
  mutation($paragraphId: String!) {
    deleteParagraph(paragraphId: $paragraphId) {
      ...articleDetail
    }
  }
  ${articleFragment}
`;

class SelectionListener extends PureComponent {
  static defaultProps = {
    onChange() {},
  };

  handleSelectionChange = () => {
    this.props.onChange(window.getSelection());
  };

  componentDidMount() {
    document.addEventListener('selectionchange', this.handleSelectionChange);
  }

  componentWillUnmount() {
    document.removeEventListener('selectionchange', this.handleSelectionChange);
  }

  render() {
    return null;
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
    onTextSelect() {},
  };

  state = {
    searchedText: '',
    hyperlinkInDialog: null,
  };

  static fragments = {
    article: articleFragment,
  };

  handleHighlightClick = e => {
    const clickedText = e.target.innerText;

    // Toggle searchedText
    this.setState(({ searchedText }) => ({
      searchedText: searchedText ? '' : clickedText,
    }));
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

  handleSelectionChange = selection => {
    this.props.onTextSelect(selection.toString().trim());
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
    const { article, classes } = this.props;

    return (
      article.hyperlinks.length > 0 && (
        <footer className={classes.hyperlinks}>
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
    const { classes } = this.props;

    return (
      <article className={classes.article}>
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
                  className: classes.isSearched,
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
    const { hyperlinkInDialog, searchedText } = this.state;
    const { article, classes } = this.props;

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

        <header className={classes.header}>
          <Typography component="h6" variant="subtitle2">
            愛家論述
          </Typography>
        </header>
        <ArticleParagraphSections
          article={article.text}
          paragraphs={article.paragraphs}
          footerContentRenderer={this.renderHyperlinks}
          articleRenderer={this.renderArticle}
          paragraphsRenderer={this.renderParagraphs}
          breakPureRender={searchedText} // Fake prop that breaks through PureComponent
        />

        <SelectionListener onChange={this.handleSelectionChange} />
      </>
    );
  }
}

export default withStyles(styles)(ArticleDetail);
