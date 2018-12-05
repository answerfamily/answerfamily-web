import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Link } from '../../routes';

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

function Paragraph({ paragraph }) {
  return (
    <Link route="article" params={{ id: paragraph.article.id }}>
      <a>{paragraph.text}</a>
    </Link>
  );
}

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
            {data.paragraphs.map(paragraph => (
              <Paragraph key={paragraph.id} paragraph={paragraph} />
            ))}
          </section>
        );
      }}
    </Query>
  );
}

export default ParagraphList;
