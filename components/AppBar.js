import React from 'react';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import RequireLogin from './RequireLogin';
import { Link } from '../routes';

function AppBar({ children, position = 'static' }) {
  return (
    <MuiAppBar position={position} color="default">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          <Link route="/">
            <a>我愛家・我解惑</a>
          </Link>
        </Typography>

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

export default AppBar;
