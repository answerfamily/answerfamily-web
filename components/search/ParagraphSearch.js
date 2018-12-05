import { Component } from 'react';
import blueGrey from '@material-ui/core/colors/blueGrey';
import RequireLogin from '../common/RequireLogin';
import SplitLayout from '../common/SplitLayout';
import RelatedParagraphList from './RelatedParagraphList';

class ParagraphSearch extends Component {
  static defaultProps = {
    onSubmit() {},
    text: '',
  };

  handleSubmit = () => {
    const { text } = this.props;
    const article = { text };
    this.props.onSubmit(article);
  };

  render() {
    const { text } = this.props;

    return (
      <SplitLayout>
        <section className="article">{text}</section>
        <section className="paragraphs">
          <RelatedParagraphList inText={text} />

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
