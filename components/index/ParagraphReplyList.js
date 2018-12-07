import gql from 'graphql-tag';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import { Link } from '../../routes';

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

const ParagraphBubble = withStyles({
  root: {
    padding: 8,
    marginBottom: 8,
  },
})(Card);

const ReplyBubble = withStyles({
  root: {
    padding: 8,
    backgroundColor: purple[400],
    color: purple[50],
  },
})(Card);

function ParagraphReply({ paragraph, reply }) {
  return (
    <Link route="article" params={{ id: paragraph.article.id }}>
      <a className="paragraph-reply">
        <ParagraphBubble>
          <Typography color="textSecondary">{paragraph.text}</Typography>
        </ParagraphBubble>
        <ReplyBubble>{reply.text}</ReplyBubble>
        <style jsx>{`
          .paragraph-reply {
            margin: 32px 8px;
            text-decoration: none;
          }
        `}</style>
      </a>
    </Link>
  );
}

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
            {data.paragraphReplies.map(({ id, paragraph, reply }) => (
              <ParagraphReply key={id} paragraph={paragraph} reply={reply} />
            ))}
            <style jsx>{`
              section {
                padding: 8px;
              }
            `}</style>
          </section>
        );
      }}
    </Query>
  );
}

export default ParagraphReplyList;
