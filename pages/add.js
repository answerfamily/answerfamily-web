import { Component } from 'react';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { produce } from 'immer';

import ParagraphBlock from '../components/ParagraphBlock';

const EMPTY_PARAGRAPH = {
  text: '',
};

class AddPage extends Component {
  state = {
    paragraphs: [],
  };

  handleParagraphAdd = () => {
    this.setState(
      produce(state => {
        state.paragraphs.push({ ...EMPTY_PARAGRAPH });
      })
    );
  };

  handleParagraphTextChange = (idx, text) => {
    this.setState(
      produce(state => {
        state.paragraphs[idx].text = text;
      })
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    const { paragraphs } = this.state;
    console.log('article', e.target.article);
    console.log('paragraphs', paragraphs);
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
            <ParagraphBlock
              key={idx}
              idx={idx}
              text={text}
              onTextChange={this.handleParagraphTextChange}
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

export default AddPage;
