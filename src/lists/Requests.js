/** @jsxImportSource @emotion/react */
import { useSelector } from 'react-redux'

import useTranslation from '../i18n/useTranslation'

import RequestsIcon from '@material-ui/icons/ListAltOutlined'

const Requests = () => {
  const t = useTranslation()

  const styles = {
    root: theme => ({}),
    listHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.85rem',
    },
  }
  return (
    <div css={styles.root}>
      <div css={styles.listHeader}>
        <div>{t('requests')}</div>
        <RequestsIcon />
      </div>
    </div>
  )
}

export default Requests
