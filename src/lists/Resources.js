/** @jsxImportSource @emotion/react */
import { useSelector } from 'react-redux'

import useTranslation from '../i18n/useTranslation'

import ResourcesIcon from '@material-ui/icons/ArtTrackOutlined'

const Resources = () => {
  const { mode } = useSelector(store => store.app)
  const t = useTranslation()

  const styles = {
    root: theme => ({}),
    listHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: mode === 'dark' ? '#9e9e9e' : 'inherit',
      '& svg': {
        fontSize: '1.8rem',
      },
      fontSize: '0.85rem',
    },
  }

  return (
    <div css={styles.root}>
      <div css={styles.listHeader}>
        <div>{t('resources')}</div>
        <ResourcesIcon />
      </div>
    </div>
  )
}

export default Resources
