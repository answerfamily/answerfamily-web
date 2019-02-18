import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

const END_TEXT_LENGTH = 5;

const styles = theme => ({
  selectedText: {
    whiteSpace: 'nowrap',
    flex: 1,
    display: 'flex',
    minWidth: 0,
    marginRight: theme.spacing.unit * 2,
  },

  withEllipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

function SelectedTextAppBar({
  selectedText,
  classes,
  onParagraphSubmit = () => {},
}) {
  const selectedTextFirstPart = selectedText.slice(0, -END_TEXT_LENGTH);
  const selectedTextSecondPart = selectedText.slice(-END_TEXT_LENGTH);

  return (
    <MuiAppBar position="fixed" color="primary">
      <Toolbar>
        <div className={classes.selectedText}>
          <span className={classes.withEllipsis}>
            已選擇：{selectedTextFirstPart}
          </span>
          {selectedTextSecondPart}
        </div>
        <Button onClick={onParagraphSubmit} variant="outlined" color="inherit">
          標為待回重點
        </Button>
      </Toolbar>
    </MuiAppBar>
  );
}

export default withStyles(styles)(SelectedTextAppBar);
