import { Component } from 'react';
import blueGrey from '@material-ui/core/colors/blueGrey';
import NewParagraph from './NewParagraph';
import RequireLogin from './RequireLogin';
import SplitLayout from './SplitLayout';

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
      <SplitLayout>
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
          .paragraphs {
            background: ${blueGrey[50]};
          }

          .article {
            display: flex;
            flex-flow: column;
          }
        `}</style>
      </SplitLayout>
    );
  }
}

export default ParagraphSearch;
