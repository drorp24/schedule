/** @jsxImportSource @emotion/react */
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDirectives } from '../redux/directives'
import directivesFields from './directivesFields'

import useTranslation from '../i18n/useTranslation'

import DirectivesIcon from '@material-ui/icons/LandscapeOutlined'

const Directives = () => {
  const t = useTranslation()
  const dispatch = useDispatch()

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
  useEffect(() => {
    dispatch(fetchDirectives({ directivesFields }))
  }, [dispatch])

  return (
    <div css={styles.root}>
      <div css={styles.listHeader}>
        <div>{t('directives')}</div>
        <DirectivesIcon />
      </div>
    </div>
  )
}

export default Directives
