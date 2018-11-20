import { Component } from 'react';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { produce } from 'immer';

import NewParagraph from '../components/NewParagraph';
import SourcesForm from '../components/SourcesForm';

const EMPTY_PARAGRAPH = {
  text: '',
};

class ArticleForm extends Component {
  static defaultProps = {
    onSubmit() {},
  };

  state = {
    text: '',
    paragraphs: [],
    sources: [],
  };

  handleParagraphAdd = () => {
    this.setState(
      produce(({ paragraphs }) => {
        paragraphs.push({ ...EMPTY_PARAGRAPH });
      })
    );
  };

  handleTextChange = e => {
    const text = e.target.value;
    this.setState(
      produce(state => {
        state.text = text;
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

  handleSourceAdd = source => {
    this.setState(
      produce(({ sources }) => {
        sources.push(source);
      })
    );
  };

  handleSourceDelete = idx => {
    this.setState(
      produce(({ sources }) => {
        sources.splice(idx, 1);
      })
    );
  };

  handleSubmit = () => {
    const { paragraphs, text, sources } = this.state;
    const article = { text, paragraphs, sources };
    this.props.onSubmit(article);
  };

  render() {
    const { paragraphs, sources, text } = this.state;

    return (
      <div className="container">
        <section className="article">
          <SourcesForm
            sources={sources}
            onAdd={this.handleSourceAdd}
            onDelete={this.handleSourceDelete}
          />
          <textarea
            name="article"
            value={text}
            onChange={this.handleTextChange}
          />
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
            新增段落
          </button>
          <button type="button" onClick={this.handleSubmit}>
            送出文章與段落
          </button>
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

export default ArticleForm;
