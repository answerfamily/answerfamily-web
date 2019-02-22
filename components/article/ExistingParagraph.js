import { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';

import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import RequireLogin from '../common/RequireLogin';
import { nl2br, mark, linkify } from '../../lib/text';
import { withStyles } from '@material-ui/core';
import { orange, grey } from '@material-ui/core/colors';

const styles = theme => ({
  root: {
    position: 'relative', // for delete button
    overflow: 'visible',
  },

  deleteButton: {
    position: 'absolute',
    width: '28px',
    height: '28px',
    minHeight: '28px',
    fontSize: '18px',
    right: theme.spacing.unit * -2,
    top: theme.spacing.unit * -2,
  },

  quote: {
    ...theme.typography.caption,
    margin: 0,
    padding: theme.spacing.unit,
    paddingRight: theme.spacing.unit * 2, // space for the trash button
    color: theme.palette.text.secondary,
    borderLeft: `4px solid ${grey[400]}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    '& mark': {
      background: orange[500],
    },
  },

  replies: {
    margin: 0,
    paddingLeft: 4, // for border left
    listStyle: 'none',
    position: 'relative' /* for rainbow border */,

    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      width: 4,
      background:
        'linear-gradient(to bottom, #FF475A, #FF475A 44px, #FF8C41 44px, #FF8C41 88px, #F0DE00 88px, #F0DE00 112px, #70CF00 112px, #70CF00 136px, #43B0FF 136px, #43B0FF 160px, #8442FF 160px, #8442FF)',
    },
  },

  reply: {
    padding: theme.spacing.unit,
    borderBottom: `1px solid ${theme.palette.divider}`,

    '&:last-child': {
      borderBottom: 0,
    },
  },

  newReplyForm: {
    padding: theme.spacing.unit,
  },
});

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

function NewReplyForm({ paragraphId, classes }) {
  return (
    <Mutation mutation={NEW_REPLY}>
      {(submit, { loading }) => {
        return (
          <form
            className={classes.newReplyForm}
            onSubmit={e => {
              e.preventDefault();
              submit({
                variables: {
                  paragraphId,
                  reply: { text: e.target.replyText.value },
                },
              });
              e.target.reset();
            }}
          >
            <TextField
              name="replyText"
              placeholder="撰寫新回應"
              multiline
              rows="4"
              variant="outlined"
              fullWidth
            />
            <button disabled={loading} type="submit">
              送出回應
            </button>
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

function Reply({ reply, classes }) {
  return <li className={classes.reply}>{nl2br(linkify(reply.text))}</li>;
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
    const { paragraph, highlightedText, classes } = this.props;
    const { tab } = this.state;

    return (
      <RequireLogin>
        {({ me }) => (
          <Card className={classes.root}>
            {me && paragraph.canDelete && (
              <Fab
                className={classes.deleteButton}
                size="small"
                onClick={this.handleDelete}
              >
                <DeleteIcon fontSize="inherit" />
              </Fab>
            )}
            <blockquote className={classes.quote}>
              {nl2br(
                mark(paragraph.text, {
                  stringsToMatch: [highlightedText],
                })
              )}
            </blockquote>

            <ul className={classes.replies}>
              {paragraph.paragraphReplies.length ? (
                paragraph.paragraphReplies.map(({ reply }) => (
                  <Reply key={reply.id} reply={reply} classes={classes} />
                ))
              ) : (
                <li>
                  <Typography component="p" variant="body2">
                    目前還沒有回應
                  </Typography>
                </li>
              )}
              {me && (
                <li>
                  <Tabs onChange={this.handleTabChange} value={tab}>
                    <Tab label="寫新的回應" />
                    <Tab label="用舊的回應" />
                  </Tabs>
                  {tab === 0 && (
                    <NewReplyForm
                      paragraphId={paragraph.id}
                      classes={classes}
                    />
                  )}
                  {tab === 1 && <ExistingReplyForm paragraph={paragraph} />}
                </li>
              )}
            </ul>
          </Card>
        )}
      </RequireLogin>
    );
  }
}

export default withStyles(styles)(ExistingParagraph);
