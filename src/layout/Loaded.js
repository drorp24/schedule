/** @jsxImportSource @emotion/react */
import Progress from './Progress'

const styles = {
  root: theme => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'purple',
  }),
  icon: {
    color: '#D5DDF6 !important',
  },
}
const Loaded = ({ loading, children }) =>
  loading === 'pending' ? <Progress /> : <>{children}</>

export default Loaded
