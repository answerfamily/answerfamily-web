import { Component } from 'react';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { produce } from 'immer';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import NewParagraph from '../components/NewParagraph';
import ExistingParagraph from '../components/ExistingParagraph';

const EMPTY_PARAGRAPH = {
  text: '',
};

class NewParagraphEditor extends Component {
  state = {
    paragraph: EMPTY_PARAGRAPH,
    createParagraph() {},
  };

  handleSubmit = () => {
    const { articleId, createParagraph } = this.props;
    const { paragraph } = this.state;
    createParagraph({
      variables: {
        articleId,
        paragraph,
      },
    });
  };

  handleParagraphTextChange = (_, text) => {
    this.setState(
      produce(({ paragraph }) => {
        paragraph.text = text;
      })
    );
  };

  render() {
    const { paragraph } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <NewParagraph
          text={paragraph.text}
          onTextChange={this.handleParagraphTextChange}
        />
        <button type="submit">新增段落</button>
      </form>
    );
  }
}

const NEW_PARAGRAPH = gql`
  mutation(articleId: String!, paragraph: ParagraphInput!){
    addParagraphToArticle(articleId: $articleId, paragraph: $paragraph) {

    }
  }
`;

const DELETE_PARAGRAPH = gql`
  mutation($paragraphId: String!) {
    deleteParagraph(paragraphId: $paragraphId) {
      id
    }
  }
`;

class ArticleDetail extends Component {
  static defaultProps = {
    createArticle() {},
  };

  handleParagraphDelete = idx => {
    this.setState(
      produce(({ paragraphs }) => {
        paragraphs.splice(idx, 1);
      })
    );
  };

  render() {
    const { article } = this.props;
    const paragraphs = article.paragraphs;

    return (
      <div className="container">
        <section className="article">{article.text}</section>
        <section className="paragraphs">
          {paragraphs.map(paragraph => (
            <Mutation key={paragraph.id} mutation={DELETE_PARAGRAPH}>
              {(deleteParagraph, { loading }) => (
                <ExistingParagraph
                  paragraph={paragraph}
                  loading={loading}
                  deleteParagraph={deleteParagraph}
                />
              )}
            </Mutation>
          ))}

          <Mutation mutation={NEW_PARAGRAPH}>
            {(createParagraph, { loading }) => (
              <NewParagraphEditor
                createParagraph={createParagraph}
                loading={loading}
              />
            )}
          </Mutation>
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

export default ArticleDetail;
