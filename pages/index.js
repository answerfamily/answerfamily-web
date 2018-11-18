import { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ParagraphList from '../components/ParagraphList';
import ParagraphReplyList from '../components/ParagraphReplyList';

class Index extends Component {
  state = {
    tab: 0,
  };

  handleTabChange = (e, tab) => {
    this.setState({ tab });
  };

  render() {
    const { tab } = this.state;

    return (
      <div>
        <Tabs onChange={this.handleTabChange} value={tab}>
          <Tab label="Paragraph Reply" />
          <Tab label="Paragraphs" />
        </Tabs>
        {tab === 0 && <ParagraphReplyList />}
        {tab === 1 && <ParagraphList />}
      </div>
    );
  }
}

export default Index;
