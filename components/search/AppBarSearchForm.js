import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Grow from '@material-ui/core/Grow';

import ArticleSearchForm from '../common/ArticleSearchForm';
import LoadingButtonWrapper from '../common/LoadingButtonWrapper';

const styles = theme => ({
  form: {
    flex: 1,
    minWidth: 0,
    position: 'relative', // for paper
  },

  fakeInput: {
    padding: 8,
    background: 'rgba(255, 255, 255, 0.1)',
    cursor: 'text',
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  paper: {
    padding: theme.spacing.unit,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
  },

  searchIcon: {
    alignSelf: 'flex-start',
    paddingTop: theme.spacing.unit,
  },
});

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
    const { text, classes } = this.props;

    return (
      <div className={classes.form}>
        {isOpen && (
          <ClickAwayListener onClickAway={this.handleClickAway}>
            <ArticleSearchForm>
              {({ inputName, defaultValue, isFetchingUrl }) => (
                <Grow in style={{ transformOrigin: '0 0 0' }}>
                  <Paper className={classes.paper} elevation={5}>
                    <InputBase
                      name={inputName}
                      defaultValue={defaultValue}
                      placeholder="輸入反對婚姻平權的 LINE 訊息、Facebook 貼文、網址⋯⋯"
                      multiline
                      rows={5}
                      fullWidth
                      endAdornment={
                        <InputAdornment
                          position="end"
                          className={classes.searchIcon}
                        >
                          <LoadingButtonWrapper
                            loading={isFetchingUrl}
                            size={48}
                          >
                            <IconButton type="submit" disabled={isFetchingUrl}>
                              <SearchIcon />
                            </IconButton>
                          </LoadingButtonWrapper>
                        </InputAdornment>
                      }
                    />
                  </Paper>
                </Grow>
              )}
            </ArticleSearchForm>
          </ClickAwayListener>
        )}
        <div className={classes.fakeInput} onClick={this.handleFakeClick}>
          {text}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AppBarSearchForm);
