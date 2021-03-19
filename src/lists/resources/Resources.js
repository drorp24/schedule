/** @jsxImportSource @emotion/react */
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchResources } from '../../redux/resources'
import resourcesFields from './resourcesFields'

import useTranslation from '../../i18n/useTranslation'

import ResourcesIcon from '@material-ui/icons/ArtTrackOutlined'

const Resources = () => {
  const t = useTranslation()
  const dispatch = useDispatch()

  const styles = {
    root: theme => ({}),
    listHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& svg': {
        fontSize: '1.8rem',
      },
      fontSize: '0.85rem',
    },
  }

  useEffect(() => {
    dispatch(fetchResources({ resourcesFields }))
  }, [dispatch])

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
