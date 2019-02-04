import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import ArticleSearchForm from '../common/ArticleSearchForm';

class AppBarSearchForm extends React.Component {
  static defaultProps = {
    text: '',
  };

  state = {
    isOpen: false,
  };

  handleFakeClick = () => {
    this.setState({ isOpen: true });
  };

  handleClickAway = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { isOpen } = this.state;
    const { text } = this.props;

    return (
      <div className="form">
        {isOpen ? (
          <ClickAwayListener onClickAway={this.handleClickAway}>
            <ArticleSearchForm />
          </ClickAwayListener>
        ) : (
          <div className="fake-input" onClick={this.handleFakeClick}>
            {text}
          </div>
        )}

        <style jsx>{`
          .form {
            position: relative;
          }

          .fake-input {
            padding: 8px;
            background: rgba(255, 255, 255, 0.1);
            cursor: text;
          }
        `}</style>
      </div>
    );
  }
}

export default AppBarSearchForm;
