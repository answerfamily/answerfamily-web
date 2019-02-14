import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import RequireLogin from '../common/RequireLogin';
const END_TEXT_LENGTH = 10;

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
          <span className={classes.withEllipsis}>{selectedTextFirstPart}</span>
          {selectedTextSecondPart}
        </div>
        <RequireLogin>
          {({ me, authorize }) => {
            if (!me) {
              return (
                <Button
                  onClick={authorize}
                  variant="outlined"
                  color="secondary"
                >
                  登入後劃重點
                </Button>
              );
            }

            return (
              <Button
                onClick={onParagraphSubmit}
                variant="outlined"
                color="secondary"
              >
                標成待回應重點
              </Button>
            );
          }}
        </RequireLogin>
      </Toolbar>
    </MuiAppBar>
  );
}

export default withStyles(styles)(SelectedTextAppBar);
