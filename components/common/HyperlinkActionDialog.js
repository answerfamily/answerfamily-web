import React, { PureComponent } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';

import { Router } from '../../routes';

const SET_SEARCH_DATA = gql`
  mutation($data: SearchDataInput) {
    setSearchedData(data: $data) @client
  }
`;

class HyperlinkActionDialog extends PureComponent {
  static defaultProps = {
    title: '',
    summary: '',
    url: '',
    articleSources: [],
    saveSearchedData() {},
  };

  handleSearch = () => {
    const { summary, url, title, saveSearchedData } = this.props;

    saveSearchedData({
      text: `${title}\n\n${summary}`,
      sourceText: title,
      sourceUrl: url,
    });
    Router.pushRoute('/search');
  };

  handleArticleClick = articleId => {
    Router.pushRoute(`/article/${articleId}`);
  };

  static fragments = {
    hyperlinkArticleSource: gql`
      fragment hyperlinkArticleSource on ArticleSource {
        id
        article {
          id
          text
          paragraphs {
            id
          }
        }
      }
    `,
  };

  render() {
    const {
      title,
      summary,
      url,
      articleSources,
      saveSearchedData,
      ...dialogProps
    } = this.props;

    return (
      <Dialog {...dialogProps}>
        <DialogTitle id="simple-dialog-title">關於「{title}」</DialogTitle>
        <div>
          <List>
            {articleSources.map(({ id, article }) => (
              <ListItem
                button
                onClick={() => this.handleArticleClick(article.id)}
                key={id}
              >
                <ListItemText
                  primary={article.text}
                  primaryTypographyProps={{
                    style: {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                  }}
                  secondary={`${article.paragraphs.length} 則段落`}
                />
              </ListItem>
            ))}
            <ListItem button onClick={this.handleSearch}>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="查詢資料庫" />
            </ListItem>
          </List>
        </div>
      </Dialog>
    );
  }
}

function HyperlinkActionDialogContainer(props) {
  return (
    <Mutation mutation={SET_SEARCH_DATA}>
      {search => (
        <HyperlinkActionDialog
          {...props}
          saveSearchedData={data => search({ variables: { data } })}
        />
      )}
    </Mutation>
  );
}

HyperlinkActionDialogContainer.fragments = HyperlinkActionDialog.fragments;

export default HyperlinkActionDialogContainer;
