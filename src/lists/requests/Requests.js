/** @jsxImportSource @emotion/react */
import { useEffect } from 'react'
import { /* useSelector, */ useDispatch } from 'react-redux'
import { fetchRequests } from '../../redux/requests'

import RequestsTable from './RequestsTable'
import requestsFields from './requestsFields'

import useTranslation from '../../i18n/useTranslation'

// import RequestsIcon from '@material-ui/icons/ListAltOutlined'

const Requests = () => {
  const t = useTranslation()
  const dispatch = useDispatch()

  const styles = {
    root: theme => ({
      height: '100%',
      fontSize: '0.85rem',
    }),
    listHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.85rem',
    },
  }

  useEffect(() => {
    dispatch(fetchRequests({ requestsFields }))
  }, [dispatch])

  return (
    <div css={styles.root}>
      {/* <div css={styles.listHeader}>
        <div>{t('requests')}</div>
        <RequestsIcon />
      </div> */}
      <RequestsTable />
    </div>
  )
}

export default Requests
