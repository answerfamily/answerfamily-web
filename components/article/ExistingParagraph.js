import { Component, Fragment } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';

import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import RequireLogin from '../common/RequireLogin';
import { nl2br, mark, linkify } from '../../lib/text';

const paragraphFragment = gql`
  fragment articleDetailParagraph on Paragraph {
    id
    text
    canDelete
    paragraphReplies {
      createdAt
      reply {
        id
        text
        note
        createdAt
      }
    }
  }
`;

const NEW_REPLY = gql`
  mutation($paragraphId: String!, $reply: ReplyInput!) {
    addReplyToParagraph(paragraphId: $paragraphId, reply: $reply) {
      ...articleDetailParagraph
    }
  }
  ${paragraphFragment}
`;

function NewReplyForm({ paragraphId }) {
  return (
    <Mutation mutation={NEW_REPLY}>
      {submit => {
        return (
          <form
            onSubmit={e => {
              e.preventDefault();
              submit({
                variables: {
                  paragraphId,
                  reply: {
                    text: e.target.replyText.value,
                    note: e.target.note.value,
                  },
                },
              });
            }}
          >
            <label>
              回應
              <textarea name="replyText" />
            </label>
            <label>
              給其他編輯的悄悄話
              <textarea name="note" />
            </label>
            <button type="submit">送出回應</button>
          </form>
        );
      }}
    </Mutation>
  );
}

const SUGGEST_REPLY = gql`
  query($text: String) {
    paragraphs(filter: { inText: $text }) {
      paragraphReplies {
        paragraph {
          id
          text
        }
        id
        createdAt
        reply {
          id
          text
          createdAt
        }
      }
    }
  }
`;

const SEARCH_REPLY = gql`
  query($text: String) {
    replies(filter: { contain: $text }) {
      ...replyFields
    }
    paragraphs(filter: { contain: $text }) {
      paragraphReplies {
        reply {
          ...replyFields
        }
      }
    }
  }

  fragment replyFields on Reply {
    id
    text
    createdAt
    paragraphReplies {
      paragraph {
        id
        text
      }
      createdAt
    }
  }
`;

const CONNECT_RPELY = gql`
  mutation($replyId: String!, $paragraphId: String!) {
    connectReplyWithParagraph(replyId: $replyId, paragraphId: $paragraphId) {
      ...articleDetailParagraph
    }
  }
  ${paragraphFragment}
`;

function ConnectReplyButton({ replyId, paragraphId }) {
  return (
    <Mutation mutation={CONNECT_RPELY}>
      {(connectReply, { loading }) => (
        <button
          onClick={() => connectReply({ variables: { replyId, paragraphId } })}
          disabled={loading}
        >
          使用此回應
        </button>
      )}
    </Mutation>
  );
}

function ReplyList({ paragraphId = '', replies = [] }) {
  return (
    <ul>
      {replies.map(reply => (
        <li key={reply.id}>
          {nl2br(linkify(reply.text))}
          <ConnectReplyButton replyId={reply.id} paragraphId={paragraphId} />
        </li>
      ))}
    </ul>
  );
}

class ExistingReplyForm extends Component {
  static defaultProps = {
    paragraph: null, // Should be object
    selectedReplyIds: [],
  };

  state = { searchedText: '' };

  handleSearch = e => {
    e.preventDefault();
    this.setState({
      searchedText: e.target.searchInput.value,
    });
  };

  render() {
    const { paragraph } = this.props;
    const { searchedText } = this.state;

    return (
      <div>
        <form onSubmit={this.handleSearch}>
          <input type="search" name="searchInput" />
          <button type="submit">搜尋</button>
        </form>
        <hr />
        {searchedText ? (
          <Query query={SEARCH_REPLY} variables={{ text: searchedText }}>
            {({ data, loading }) => {
              if (loading) return <p>Loading</p>;

              const repliesFromSimilarParagraphs = data.paragraphs.reduce(
                (replies, paragraph) =>
                  replies.concat(
                    paragraph.paragraphReplies.reduce(
                      (replies, pr) => replies.concat(pr.reply),
                      []
                    )
                  ),
                []
              );
              return (
                <div>
                  有「{searchedText}」在內的回應
                  <ReplyList
                    paragraphId={paragraph.id}
                    replies={data.replies}
                  />
                  有「{searchedText}」在內的文章的回應
                  <ReplyList
                    paragraphId={paragraph.id}
                    replies={repliesFromSimilarParagraphs}
                  />
                </div>
              );
            }}
          </Query>
        ) : (
          <Query query={SUGGEST_REPLY} variables={{ text: paragraph.text }}>
            {({ data, loading }) => {
              if (loading) return <p>Loading</p>;

              const replies = data.paragraphs.reduce(
                (replies, paragraph) =>
                  replies.concat(
                    paragraph.paragraphReplies.reduce(
                      (replies, pr) => replies.concat(pr.reply),
                      []
                    )
                  ),
                []
              );
              return <ReplyList paragraphId={paragraph.id} replies={replies} />;
            }}
          </Query>
        )}
      </div>
    );
  }
}

class ExistingParagraph extends Component {
  static defaultProps = {
    paragraph: null, // should be an object
    highlightedText: '',
    onDelete() {},
  };

  static fragments = {
    paragraph: paragraphFragment,
  };

  state = {
    tab: 0,
  };

  handleTabChange = (e, tab) => {
    this.setState({ tab });
  };

  handleDelete = () => {
    const { paragraph, deleteParagraph } = this.props;
    deleteParagraph({ variables: { paragraphId: paragraph.id } });
  };

  render() {
    const { paragraph, highlightedText } = this.props;
    const { tab } = this.state;
    return (
      <Card style={{ marginBottom: 8 }}>
        <header>
          <Typography color="secondary" style={{ marginRight: 'auto' }}>
            原句
          </Typography>
          <RequireLogin>
            {({ me }) =>
              me &&
              paragraph.canDelete && (
                <DeleteIcon
                  color="secondary"
                  size="small"
                  onClick={this.handleDelete}
                />
              )
            }
          </RequireLogin>
        </header>
        <article className="paragraph">
          <Typography color="textSecondary">
            {nl2br(
              mark(paragraph.text, {
                stringsToMatch: [highlightedText],
              })
            )}
          </Typography>
        </article>
        <hr />
        現有回應
        <ul>
          {paragraph.paragraphReplies.map(({ reply }) => (
            <li key={reply.id}>
              {nl2br(linkify(reply.text))} ({reply.note})
            </li>
          ))}
        </ul>
        <RequireLogin>
          {({ me, authorize }) => {
            if (!me) {
              return (
                <p>
                  請<button onClick={authorize}>登入</button>來送出回應
                </p>
              );
            }
            return (
              <Fragment>
                <hr />
                <Tabs onChange={this.handleTabChange} value={tab}>
                  <Tab label="寫新的回應" />
                  <Tab label="用舊的回應" />
                </Tabs>
                {tab === 0 && <NewReplyForm paragraphId={paragraph.id} />}
                {tab === 1 && <ExistingReplyForm paragraph={paragraph} />}
              </Fragment>
            );
          }}
        </RequireLogin>
        <style jsx>{`
          header {
            display: flex;
            padding: 4px;
          }
          .paragraph :global(mark) {
            background: orange;
          }
        `}</style>
      </Card>
    );
  }
}

export default ExistingParagraph;
