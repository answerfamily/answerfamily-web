import { Component } from 'react';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { produce } from 'immer';

import NewParagraph from '../components/NewParagraph';

const EMPTY_PARAGRAPH = {
  text: '',
};

class ArticleForm extends Component {
  static defaultProps = {
    createArticle() {},
  };

  state = {
    paragraphs: [],
  };

  handleParagraphAdd = () => {
    this.setState(
      produce(({ paragraphs }) => {
        paragraphs.push({ ...EMPTY_PARAGRAPH });
      })
    );
  };

  handleParagraphTextChange = (idx, text) => {
    this.setState(
      produce(({ paragraphs }) => {
        paragraphs[idx].text = text;
      })
    );
  };

  handleParagraphDelete = idx => {
    this.setState(
      produce(({ paragraphs }) => {
        paragraphs.splice(idx, 1);
      })
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    const { paragraphs } = this.state;
    this.props.createArticle({
      variables: {
        article: {
          text: e.target.article.value,
          paragraphs,
        },
      },
    });
  };

  render() {
    const { paragraphs } = this.state;

    return (
      <form className="container" onSubmit={this.handleSubmit}>
        <section className="article">
          <textarea name="article" />
        </section>
        <section className="paragraphs">
          {paragraphs.map(({ text }, idx) => (
            <NewParagraph
              key={idx}
              idx={idx}
              text={text}
              onTextChange={this.handleParagraphTextChange}
              onDelete={this.handleParagraphDelete}
            />
          ))}
          <button type="button" onClick={this.handleParagraphAdd}>
            Add paragraph
          </button>
          <button type="submit">Submit article and paragraphs</button>
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
      </form>
    );
  }
}

export default ArticleForm;
