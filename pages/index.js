import { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withTheme } from '@material-ui/core/styles';

import AppBar from '../components/common/AppBar';
import ArticleSearchForm from '../components/index/ArticleSearchForm';
import ArticleList from '../components/index/ArticleList';
import ParagraphReplyList from '../components/index/ParagraphReplyList';
import ReplyList from '../components/index/ReplyList';

class Index extends Component {
  state = {
    tab: 1,
  };

  handleTabChange = (e, tab) => {
    this.setState({ tab });
  };

  render() {
    const { theme } = this.props;
    const { tab } = this.state;

    return (
      <div>
        <AppBar position="fixed" />
        <header className="jumbotron">
          <ArticleSearchForm />
        </header>
        <Tabs onChange={this.handleTabChange} value={tab}>
          <Tab label="愛家訊息集錦" />
          <Tab label="最新的對話" />
          <Tab label="回應列表" />
        </Tabs>
        {tab === 0 && <ArticleList />}
        {tab === 1 && <ParagraphReplyList />}
        {tab === 2 && <ReplyList />}

        <style jsx>{`
          .jumbotron {
            position: relative;
            z-index: ${theme.zIndex.appBar + 1}; /* Higher than AppBar */
            background: #fff;
            padding: 20px;
          }
        `}</style>
      </div>
    );
  }
}

export default withTheme()(Index);
