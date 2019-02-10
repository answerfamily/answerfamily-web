import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Link } from '../../routes';
import Card from '@material-ui/core/Card';

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

function Paragraph({ paragraph }) {
  return (
    <Card>
      原句：
      <Link route="article" params={{ id: paragraph.article.id }}>
        <a>{paragraph.text}</a>
      </Link>
      <hr />
      {paragraph.paragraphReplies.length > 0 && (
        <ul>
          {paragraph.paragraphReplies.map(({ id, reply }) => (
            <li key={id}>{reply.text}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function RelatedParagraphList({ inText = '' }) {
  if (!inText) return null;

  return (
    <Query query={LIST_RELATED_PARAGRAPHS} variables={{ inText }}>
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

export default RelatedParagraphList;
