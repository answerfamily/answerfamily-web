import { Component } from 'react';
import blueGrey from '@material-ui/core/colors/blueGrey';
import NewParagraph from './NewParagraph';

class ParagraphSearch extends Component {
  static defaultProps = {
    onSubmit() {},
    text: '',
    paragraphs: [],
  };

  handleSubmit = () => {
    const { text } = this.props;
    const article = { text };
    this.props.onSubmit(article);
  };

  render() {
    const { paragraphs, text } = this.props;

    return (
      <div className="container">
        <section className="article">
          {text}
          <textarea
            name="article"
            value={text}
            onChange={this.handleTextChange}
          />
        </section>
        <section className="paragraphs">
          {paragraphs.map(({ text }, idx) => (
            <NewParagraph key={idx} idx={idx} text={text} />
          ))}
        </section>

        <style jsx>{`
          .container {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            display: flex;
            flex-flow: column;
          }

          @media (min-aspect-ratio: 1/1) {
            .container {
              flex-flow: row;
            }
          }

          .paragraphs {
            flex: 1;
            background: ${blueGrey[50]};
          }

          .article {
            flex: 1;
            display: flex;
            flex-flow: column;
          }

          .article textarea {
            flex: 1;
          }
        `}</style>
      </div>
    );
  }
}

export default ParagraphSearch;
