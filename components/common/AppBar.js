import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import RequireLogin from './RequireLogin';
import { Link } from '../../routes';
import { Hidden } from '@material-ui/core';

const styles = theme => ({
  title: {
    ...theme.typography.h6,
    margin: `0 auto 0 0`,
    paddingRight: theme.spacing.unit * 2,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
    '& img': {
      verticalAlign: 'middle',
      marginRight: theme.spacing.unit * 2,
    },
  },
});

function AppBar({ children, position = 'static', classes }) {
  return (
    <MuiAppBar position={position} color="default">
      <Toolbar>
        <Link route="/">
          <a className={classes.title}>
            <img src={require('./appbar-logo.svg')} alt="Logo" />
            <Hidden smDown>我愛家・我解惑</Hidden>
          </a>
        </Link>

        {children}

        <RequireLogin>
          {({ me, authorize, deauthorize }) => {
            if (!me) {
              return <Button onClick={authorize}>登入</Button>;
            }

            return (
              <div>
                {me.name}
                <Button onClick={deauthorize}>登出</Button>
              </div>
            );
          }}
        </RequireLogin>
      </Toolbar>
    </MuiAppBar>
  );
}

export default withStyles(styles)(AppBar);
