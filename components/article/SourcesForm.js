import { Component, PureComponent } from 'react';
import gql from 'graphql-tag';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  container: {
    ...theme.mixins.gutters(),
    margin: `${theme.spacing.unit * 2}px 0`,
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
    const { note, url, onDelete } = this.props;
    return (
      <li>
        {note}
        <br />
        {url}
        {onDelete && (
          <button type="button" onClick={this.handleDelete}>
            刪除
          </button>
        )}
      </li>
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

  render() {
    const { sources, onAdd, onDelete, classes } = this.props;

    return (
      <section className={classes.container}>
        <h6>愛家論述出處</h6>
        <ul>
          {sources.map(({ note, url }, idx) => (
            <Source
              key={idx}
              idx={idx}
              note={note}
              url={url}
              onDelete={onDelete}
            />
          ))}
        </ul>
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
