import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

const styles = {
  wrapper: {
    display: 'inline-block',
    position: 'relative',
  },
  loading: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: 'var(--shift)',
    marginTop: 'var(--shift)',
  },
};

function LoadingButtonWrapper({
  children = null,
  loading = false,
  size = 24,
  classes,
  ...progressProps
}) {
  return (
    <div className={classes.wrapper}>
      {children}
      {loading && (
        <CircularProgress
          className={classes.loading}
          size={size}
          style={{ '--shift': `-${size / 2}px` }}
          {...progressProps}
        />
      )}
    </div>
  );
}

export default withStyles(styles)(LoadingButtonWrapper);
