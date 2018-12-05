import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const LIST_ARTICLES = gql`
  {
    paragraphReplies {
      id
      paragraph {
        id
        text
        article {
          id
        }
      }
      reply {
        text
      }
    }
  }
`;

function ParagraphReplyList() {
  return (
    <Query query={LIST_ARTICLES}>
      {({ loading, data, error }) => {
        if (error) {
          return <p>Error {error}</p>;
        }

        if (loading) {
          return <p>Loading</p>;
        }

        return (
          <section>
            paragraphReplies
            {data.paragraphReplies.map(paragraphReply => (
              <div key={paragraphReply.id}>
                {JSON.stringify(paragraphReply)}
              </div>
            ))}
          </section>
        );
      }}
    </Query>
  );
}

export default ParagraphReplyList;
