import { Component, PureComponent } from 'react';
import gql from 'graphql-tag';
import {
  withStyles,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  ListSubheader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';

import { linkify } from '../../lib/text';
import RequireLogin from '../common/RequireLogin';

const styles = theme => ({
  container: {
    ...theme.mixins.gutters(),
    margin: `${theme.spacing.unit * 2}px 0`,
  },
  header: {
    position: 'relative', // for <ListItemSecondaryAction>
  },
  preview: {
    borderRadius: `${theme.spacing.unit}px`,
  },
});

class Source extends PureComponent {
  static defaultProps = {
    idx: 0,
    note: '',
    url: '',
    onDelete: null,
  };

  handleDelete = () => {
    const { idx, onDelete } = this.props;
    onDelete(idx);
  };

  render() {
    const { note, url, topImageUrl, onDelete, classes } = this.props;
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar className={classes.preview} src={topImageUrl} />
        </ListItemAvatar>
        <ListItemText primary={note} secondary={linkify(url)} />
        {onDelete && (
          <ListItemSecondaryAction>
            <IconButton onClick={this.handleDelete}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    );
  }
}

class SourcesForm extends Component {
  static defaultProps = {
    sources: [],
    onAdd: null, // Should be function. If not given, hide the form.
    onDelete: null, // Should be funciton. If not given, hide the delete button.
  };

  static fragments = {
    sources: gql`
      fragment articleSource on ArticleSource {
        id
        note
        url
        createdAt
        hyperlink {
          topImageUrl
        }
      }
    `,
  };

  state = {
    showNewSourceForm: false,
  };

  toggleNewSourceForm = () => {
    this.setState(({ showNewSourceForm }) => ({
      showNewSourceForm: !showNewSourceForm,
    }));
  };

  handleNewSourceSubmit = e => {
    e.preventDefault();

    const source = {
      note: e.target.note.value,
      url: e.target.url.value,
    };

    this.props.onAdd(source);

    e.target.reset();
  };

  renderHeader = () => {
    const { classes, onAdd } = this.props;

    return (
      <RequireLogin>
        {({ me }) => (
          <ListSubheader className={classes.header} disableSticky={true}>
            愛家論述出處
            {me && onAdd && (
              <ListItemSecondaryAction>
                <IconButton onClick={this.toggleNewSourceForm}>
                  <AddIcon color="primary" />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListSubheader>
        )}
      </RequireLogin>
    );
  };

  render() {
    const { sources, onDelete, classes } = this.props;
    const { showNewSourceForm } = this.state;

    return (
      <section className={classes.container}>
        <List subheader={this.renderHeader()}>
          {sources.map(({ note, url, hyperlink }, idx) => (
            <Source
              key={idx}
              idx={idx}
              note={note}
              url={url}
              topImageUrl={hyperlink && hyperlink.topImageUrl}
              onDelete={onDelete}
              classes={classes}
            />
          ))}
        </List>
        <Dialog open={showNewSourceForm} onClose={this.toggleNewSourceForm}>
          <form onSubmit={this.handleNewSourceSubmit}>
            <DialogTitle>新增論述出處</DialogTitle>
            <DialogContent>
              <DialogContentText>
                若您發現這個論述刊載在網路上的其他地方，請提供在此。新增出處之後，這個資料庫會把內文中提及此連結的其他論述，都連結到這裡來。
              </DialogContentText>

              <TextField
                label="簡短描述出處"
                name="note"
                fullWidth
                margin="normal"
              />
              <TextField label="URL" name="url" fullWidth margin="normal" />
            </DialogContent>
            <DialogActions>
              <Button color="primary" type="submit">
                新增此出處
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </section>
    );
  }
}

export default withStyles(styles)(SourcesForm);
