import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const LIST_PARAGRAPHS = gql`
  {
    paragraphs {
      id
      text
      createdAt
      article {
        id
        text
      }
      paragraphReplies {
        id
      }
    }
  }
`;

function ParagraphList() {
  return (
    <Query query={LIST_PARAGRAPHS}>
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
            {data.paragraphs.map(paragraph => (
              <div key={paragraph.id}>{JSON.stringify(paragraph)}</div>
            ))}
          </section>
        );
      }}
    </Query>
  );
}

export default ParagraphList;
