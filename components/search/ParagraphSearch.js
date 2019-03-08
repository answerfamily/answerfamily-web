import gql from 'graphql-tag';
import { Component } from 'react';
import { Query } from 'react-apollo';
import RequireLogin from '../common/RequireLogin';
import ArticleParagraphSections from '../common/ArticleParagraphSections';
import ExistingParagraph from '../article/ExistingParagraph';
import { mark, nl2br, linkify } from '../../lib/text';

const LIST_RELATED_PARAGRAPHS = gql`
  query($inText: String) {
    paragraphs(filter: { inText: $inText, includeHighlight: true }) {
      id
      text
      _highlight
      createdAt
      article {
        id
        text
      }
      paragraphReplies {
        id
        reply {
          text
        }
      }
    }
  }
`;

class ParagraphSearch extends Component {
  static defaultProps = {
    onSubmit() {},
    text: '',
  };

  renderArticle = ({ text, highlights }) => {
    return (
      <article>
        {nl2br(
          linkify(
            mark(
              mark(text, {
                stringsToMatch: highlights,
                props: {
                  onClick: this.handleHighlightClick,
                },
              })
            ),
            { props: { onClick: this.handleUrlClick } }
          )
        )}
      </article>
    );
  };

  renderParagraphs = ({ paragraphs, style }) => {
    return (
      <section style={style}>
        {paragraphs.map(paragraph => (
          <ExistingParagraph key={paragraph.id} paragraph={paragraph} />
        ))}
      </section>
    );
  };

  renderFooter = () => {
    const { onSubmit } = this.props;

    return (
      <footer>
        <RequireLogin>
          {({ me, authorize }) => {
            if (me) {
              return (
                <button type="button" onClick={onSubmit}>
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
      </footer>
    );
  };

  render() {
    const { text } = this.props;

    return (
      <Query query={LIST_RELATED_PARAGRAPHS} variables={{ inText: text }}>
        {({ loading, data, error }) => {
          if (error) {
            return <p>Error {error}</p>;
          }

          if (loading) {
            return <p>Loading</p>;
          }

          return (
            <ArticleParagraphSections
              article={text}
              paragraphs={data.paragraphs}
              articleRenderer={this.renderArticle}
              paragraphsRenderer={this.renderParagraphs}
              footerContentRenderer={this.renderFooter}
            />
          );
        }}
      </Query>
    );
  }
}

export default ParagraphSearch;
