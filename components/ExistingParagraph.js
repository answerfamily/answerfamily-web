import { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const NEW_REPLY = gql`
  mutation($paragraphId: String!, $reply: ReplyInput!) {
    addReplyToParagraph(paragraphId: $paragraphId, reply: $reply) {
      paragraphReplies {
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
    paragraphs(filter: { contain: $text }) {
      paragraphReplies {
        paragraph {
          id
          text
        }
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

const CONNECT_RPELY = gql`
  mutation($replyId: String!, $paragraphId: String!) {
    connectReplyWithParagraph(replyId: $replyId, paragraphId: $paragraphId) {
      paragraphReplies {
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

function ParagraphReplyList({ paragraphId = '', paragraphReplies = [] }) {
  return (
    <ul>
      {paragraphReplies.map(pr => (
        <li key={pr.id}>
          {pr.reply.text}{' '}
          <ConnectReplyButton replyId={pr.reply.id} paragraphId={paragraphId} />
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

              const paragraphReplies = data.paragraphs.reduce(
                (prs, paragraph) => prs.concat(paragraph.paragraphReplies),
                []
              );
              return (
                <ParagraphReplyList
                  paragraphId={paragraph.id}
                  paragraphReplies={paragraphReplies}
                />
              );
            }}
          </Query>
        ) : (
          <Query query={SUGGEST_REPLY} variables={{ text: paragraph.text }}>
            {({ data, loading }) => {
              if (loading) return <p>Loading</p>;

              const paragraphReplies = data.paragraphs.reduce(
                (prs, paragraph) => prs.concat(paragraph.paragraphReplies),
                []
              );
              return (
                <ParagraphReplyList
                  paragraphId={paragraph.id}
                  paragraphReplies={paragraphReplies}
                />
              );
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
    onDelete() {},
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
    const { paragraph } = this.props;
    const { tab } = this.state;
    return (
      <div>
        <button type="button" onClick={this.handleDelete}>
          Delete
        </button>
        {paragraph.text}
        <hr />
        現有回應
        <ul>
          {paragraph.paragraphReplies.map(({ reply }) => (
            <li key={reply.id}>
              {reply.text} ({reply.note})
            </li>
          ))}
        </ul>
        <hr />
        <Tabs onChange={this.handleTabChange} value={tab}>
          <Tab label="寫新的回應" />
          <Tab label="用舊的回應" />
        </Tabs>
        {tab === 0 && <NewReplyForm paragraphId={paragraph.id} />}
        {tab === 1 && <ExistingReplyForm paragraph={paragraph} />}
      </div>
    );
  }
}

export default ExistingParagraph;
