import { PureComponent } from 'react';

class NewParagraph extends PureComponent {
  static defaultProps = {
    idx: 0,
    text: '',
    onTextChange() {},
    onDelete: null, // If not given, hides delete button
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
    const { text, onDelete } = this.props;

    return (
      <div>
        <textarea value={text} onChange={this.handleTextChange} />
        {onDelete && (
          <button type="button" onClick={this.handleDelete}>
            刪除
          </button>
        )}
      </div>
    );
  }
}

export default NewParagraph;
