import { withStyles } from '@material-ui/core';

const styles = theme => ({
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexFlow: 'column',
    background: theme.palette.background.default,
  },
});

/**
 * Add AppBar and container to layout.
 *
 * @param {ReactElement[]} props.children
 */
function Layout({ children, classes }) {
  return <div className={classes.layout}>{children}</div>;
}

export default withStyles(styles)(Layout);
