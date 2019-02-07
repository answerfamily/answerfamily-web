import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import RequireLogin from './RequireLogin';
import { Link } from '../../routes';

const styles = theme => ({
  title: {
    ...theme.typography.h6,
    margin: `0 auto 0 ${theme.spacing.unit * 2}px`,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

function AppBar({ children, position = 'static', classes }) {
  return (
    <MuiAppBar position={position} color="default">
      <Toolbar>
        <img src={require('./appbar-logo.svg')} alt="Logo" />
        <Link route="/">
          <a className={classes.title}>我愛家・我解惑</a>
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
