import { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from '../routes';

export const GET_REPLY = gql`
  query($id: String!) {
    reply(id: $id) {
      id
      text
      paragraphReplies {
        paragraph {
          text
          article {
            id
          }
        }
      }
    }
  }
`;

class ReplyPage extends Component {
  static getInitialProps({ query }) {
    return {
      id: query.id,
    };
  }

  render() {
    const { id } = this.props;

    return (
      <Query query={GET_REPLY} variables={{ id: id }}>
        {({ loading, data, error }) => {
          if (loading) {
            return <p>Loading...</p>;
          }

          if (error) {
            return <p>Error: {error.toString()}</p>;
          }

          const { reply } = data;

          return (
            <div>
              <h1>回應文字</h1>
              <article>{reply.text}</article>

              <h1>用在回應的段落</h1>
              <ul>
                {reply.paragraphReplies.map(paragraphReply => (
                  <li key={paragraphReply.id}>
                    <Link
                      route="reply"
                      params={{ id: paragraphReply.paragraph.article.id }}
                    >
                      <a>{paragraphReply.paragraph.text}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default ReplyPage;
