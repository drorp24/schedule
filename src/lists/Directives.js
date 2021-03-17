/** @jsxImportSource @emotion/react */
import { useSelector } from 'react-redux'

import useTranslation from '../i18n/useTranslation'

import DirectivesIcon from '@material-ui/icons/LandscapeOutlined'

const Directives = () => {
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
      fontSize: '0.85rem',
    },
  }
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
