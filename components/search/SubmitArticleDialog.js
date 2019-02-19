import React from 'react';
import gql from 'graphql-tag';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Mutation } from 'react-apollo';

import SourcesForm from '../common/SourcesForm';
import LoadingButtonWrapper from '../common/LoadingButtonWrapper';
import Redirect from '../common/Redirect';

const styles = theme => ({
  title: {
    flex: 1,
  },

  article: {
    ...theme.mixins.gutters(),
  },
});

export const CREATE_ARTCILE = gql`
  mutation($article: ArticleInput) {
    createArticle(article: $article) {
      id
    }
  }
`;

class ArticleSubmissionForm extends React.Component {
  static defaultProps = {
    loading: false,
    sourceText: null,
    sourceUrl: null,
    text: '',
    onClose() {},
    onSubmit() {},
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
    const { text, loading, classes, onClose } = this.props;
    const { sources } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
            <IconButton color="inherit" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.title}>
              把愛家論述送進資料庫
            </Typography>
            <LoadingButtonWrapper loading={loading}>
              <Button disabled={loading} type="submit" color="inherit">
                送出
              </Button>
            </LoadingButtonWrapper>
          </Toolbar>
        </AppBar>
        <SourcesForm
          sources={sources}
          onAdd={this.handleSourceAdd}
          onDelete={this.handleSourceDelete}
        />
        <article className={classes.article}>
          <TextField
            label="新愛家論述"
            variant="outlined"
            name="text"
            defaultValue={text}
            multiline
            fullWidth
          />
        </article>
      </form>
    );
  }
}

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

function SubmitArticleDialog({
  searchedData: { text, sourceText, sourceUrl },
  onClose = () => {},
  classes,
  ...dialogProps
}) {
  return (
    <Dialog fullScreen TransitionComponent={Transition} {...dialogProps}>
      <Mutation mutation={CREATE_ARTCILE}>
        {(createArticle, { data, called, loading, error }) => {
          if (called && data) {
            return <Redirect to={`/article/${data.createArticle.id}`} />;
          }
          if (error) {
            return <p>Error: {error.toString()}</p>;
          }
          return (
            <ArticleSubmissionForm
              loading={loading}
              text={text}
              sourceText={sourceText}
              sourceUrl={sourceUrl}
              onSubmit={article => createArticle({ variables: { article } })}
              onClose={onClose}
              classes={classes}
            />
          );
        }}
      </Mutation>
    </Dialog>
  );
}

export default withStyles(styles)(SubmitArticleDialog);
