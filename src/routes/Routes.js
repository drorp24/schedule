/** @jsxImportSource @emotion/react */
import useTranslation from '../i18n/useTranslation'

const styles = {
  root: theme => ({
    color: theme.palette.text.primary,
    background: theme.palette.background.default,
    lineHeight: '50vw',
    textAlign: 'center',
    fontSize: '5rem',
  }),
}

const Routes = () => <div css={styles.root}>{useTranslation()('routes')}</div>

export default Routes
