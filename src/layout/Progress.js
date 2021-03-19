/** @jsxImportSource @emotion/react */
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = {
  root: theme => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  icon: {
    color: '#D5DDF6 !important',
  },
}

const Progress = () => (
  <div css={styles.root}>
    <CircularProgress css={styles.icon} />
  </div>
)

export default Progress
