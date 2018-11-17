import { PureComponent } from 'react';

class ParagraphBlock extends PureComponent {
  static defaultProps = {
    idx: 0,
    text: '',
    onTextChange() {},
    onDelete() {},
  };

  handleTextChange = e => {
    const { idx, onTextChange } = this.props;
    return onTextChange(idx, e.target.value);
  };

  handleDelete = () => {
    const { idx, onDelete } = this.props;
    return onDelete(idx);
  };

  render() {
    const { text } = this.props;

    return (
      <div>
        <textarea value={text} onChange={this.handleTextChange} />
        <button type="button" onClick={this.handleDelete}>
          Delete
        </button>
      </div>
    );
  }
}

export default ParagraphBlock;
