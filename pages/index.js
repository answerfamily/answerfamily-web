import { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';

import AppBar from '../components/common/AppBar';
import ArticleSearchForm from '../components/common/ArticleSearchForm';
import LoadingButtonWrapper from '../components/common/LoadingButtonWrapper';
import ArticleList from '../components/index/ArticleList';
import ParagraphReplyList from '../components/index/ParagraphReplyList';
import ReplyList from '../components/index/ReplyList';

const styles = theme => ({
  jumbotron: {
    position: 'relative',
    zIndex: theme.zIndex.appBar + 1 /* Higher than AppBar */,
    background: '#fff',
    padding: '20px',
  },

  paper: {
    padding: theme.spacing.unit,
  },

  searchIcon: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },

  footer: {
    paddingTop: theme.spacing.unit * 2,
    textAlign: 'center',
  },
});

class Index extends Component {
  state = {
    tab: 1,
  };

  handleTabChange = (e, tab) => {
    this.setState({ tab });
  };

  render() {
    const { classes } = this.props;
    const { tab } = this.state;

    return (
      <div>
        <AppBar position="fixed" />
        <header className={classes.jumbotron}>
          <ArticleSearchForm>
            {({ inputName, defaultValue, isFetchingUrl }) => (
              <>
                <Paper className={classes.paper}>
                  <InputBase
                    name={inputName}
                    defaultValue={defaultValue}
                    placeholder="輸入反對婚姻平權的 LINE 訊息、Facebook 貼文、網址⋯⋯"
                    multiline
                    rows={5}
                    fullWidth
                    startAdornment={
                      <InputAdornment
                        position="start"
                        className={classes.searchIcon}
                      >
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </Paper>
                <footer className={classes.footer}>
                  <LoadingButtonWrapper loading={isFetchingUrl}>
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      size="large"
                      disabled={isFetchingUrl}
                    >
                      看說法
                    </Button>
                  </LoadingButtonWrapper>
                </footer>
              </>
            )}
          </ArticleSearchForm>
        </header>
        <Tabs onChange={this.handleTabChange} value={tab}>
          <Tab label="愛家訊息集錦" />
          <Tab label="最新的對話" />
          <Tab label="回應列表" />
        </Tabs>
        {tab === 0 && <ArticleList />}
        {tab === 1 && <ParagraphReplyList />}
        {tab === 2 && <ReplyList />}
      </div>
    );
  }
}

export default withStyles(styles)(Index);
