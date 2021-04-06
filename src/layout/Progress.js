/** @jsxImportSource @emotion/react */
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = {
  root: theme => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  icon: {
    // color: '#D5DDF6 !important',
  },
  text: theme => ({
    color: theme.palette.primary.main,
    marginTop: '1rem',
  }),
}

const Progress = () => (
  <div css={styles.root}>
    <CircularProgress css={styles.icon} />
    <div css={styles.text}>Loading...</div>
  </div>
)

export default Progress
