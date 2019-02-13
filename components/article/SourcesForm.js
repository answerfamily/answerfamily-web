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
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { linkify } from '../../lib/text';

const styles = theme => ({
  container: {
    ...theme.mixins.gutters(),
    margin: `${theme.spacing.unit * 2}px 0`,
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
    return <ListSubheader disableSticky={true}>愛家論述出處</ListSubheader>;
  };

  render() {
    const { sources, onAdd, onDelete, classes } = this.props;

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
        {onAdd && (
          <form onSubmit={this.handleNewSourceSubmit}>
            <label>
              URL
              <input type="text" name="url" />
            </label>
            <label>
              描述
              <input type="text" name="note" />
            </label>

            <button type="submit">新增出處</button>
          </form>
        )}
      </section>
    );
  }
}

export default withStyles(styles)(SourcesForm);
