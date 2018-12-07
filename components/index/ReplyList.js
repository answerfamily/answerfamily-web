import gql from 'graphql-tag';
import Card from '@material-ui/core/Card';
import { Query } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';

import { Link } from '../../routes';

const LIST_REPLIES = gql`
  {
    replies {
      id
      text
      createdAt
    }
  }
`;

const ReplyBubble = withStyles({
  root: {
    padding: 8,
    margin: '16px 8px',
  },
})(Card);

function Reply({ reply }) {
  return (
    <Link route="reply" params={{ id: reply.id }}>
      <a>
        <ReplyBubble>{reply.text}</ReplyBubble>
        <style jsx>{`
          a {
            color: rgba(0, 0, 0, 0.8);
            text-decoration: none;
          }
        `}</style>
      </a>
    </Link>
  );
}

function ReplyList() {
  return (
    <Query query={LIST_REPLIES}>
      {({ loading, data, error }) => {
        if (error) {
          return <p>Error {error}</p>;
        }

        if (loading) {
          return <p>Loading</p>;
        }

        return (
          <section>
            {data.replies.map(reply => (
              <Reply key={reply.id} reply={reply} />
            ))}
          </section>
        );
      }}
    </Query>
  );
}

export default ReplyList;
