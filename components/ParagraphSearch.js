import { Component } from 'react';
import blueGrey from '@material-ui/core/colors/blueGrey';
import NewParagraph from './NewParagraph';
import RequireLogin from './RequireLogin';

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
        <section className="article">{text}</section>
        <section className="paragraphs">
          {paragraphs.map(({ text }, idx) => (
            <NewParagraph key={idx} idx={idx} text={text} />
          ))}

          <RequireLogin>
            {({ me, authorize }) => {
              if (me) {
                return (
                  <button type="button" onClick={this.handleSubmit}>
                    送出文章
                  </button>
                );
              }

              return (
                <p>
                  請先{' '}
                  <button type="button" onClick={authorize}>
                    登入
                  </button>{' '}
                  才能送出文章
                </p>
              );
            }}
          </RequireLogin>
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
            min-width: 0;
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
