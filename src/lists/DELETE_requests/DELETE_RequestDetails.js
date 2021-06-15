/** @jsxImportSource @emotion/react */
import useTheme from '../../styling/useTheme'
import { useLocale, useMode, snake2human } from '../../utility/appUtilities'
import useTranslation from '../../i18n/useTranslation'

import { ThemeProvider, makeStyles } from '@material-ui/core/styles'
// import Chip from '@material-ui/core/Chip'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
// import CardActions from '@material-ui/core/CardActions'
// import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'
// import RequestsIcon from '@material-ui/icons/ListAltOutlined'
// import PinDropOutlinedIcon from '@material-ui/icons/PinDropOutlined'
import config from '../config'

const RequestDetails = ({ entity: { id, priority, ...rest } }) => {
  const { direction } = useLocale()
  const { otherMode } = useMode()
  const t = useTranslation()
  const theme = useTheme({ mode: otherMode, direction })

  const color = config.requests.color
  // const icon = <RequestsIcon />

  const useStyles = makeStyles(theme => ({
    icon: {
      color: 'rgba(0, 0, 0, 0.4)',
    },
    label: {
      color: 'rgba(0, 0, 0, 0.6)',
    },
    deleteIcon: {
      color: 'rgba(0, 0, 0, 0.4)',
    },
    title: {
      color: `${color} !important`,
      fontWeight: '500',
      textTransform: 'uppercase',
      fontStretch: 'extra-expanded',
    },
    content: {
      display: 'flex',
      flexDirection: 'column-reverse',
      textAlign: 'right',
    },
    subheader: {
      color: '#bdbdbd',
      fontSize: '0.85rem',
    },
  }))

  const classes = useStyles()

  const styles = {
    root: {
      backgroundColor: 'transparent !important',
      padding: '0.75rem',
    },
    entityType: {
      backgroundColor: `${color} !important`,
    },
    cardHeader: {
      padding: 0,
      justifyContent: 'space-between',
      marginBottom: '1rem',
    },
    cardContent: {
      padding: 0,
      marginTop: '1rem',
      '&: last-child': {
        paddingBottom: 0,
      },
    },
    avatar: {
      backgroundColor: `${color} !important`,
      color: '#fff',
      fontWeight: '300',
    },
    details: {
      fontWeight: '100',
      fontSize: '0.8rem',
      textAlign: 'center',
    },
    divider: {
      backgroundColor: `${color} !important`,
      '&::before': {
        borderColor: 'pink',
      },
    },
    subTypes: {
      padding: '1rem',
      lineHeight: '2rem',
      '& > div': {
        margin: '0 0.5rem',
      },
    },
    explainer: {
      direction: 'ltr',
      backgroundColor: 'rgba(256, 256, 256, 0.1)',
      marginTop: '1rem',
      line: {
        padding: '0.3rem',
        display: 'flex',
        justifyContent: 'space-between',
        lineHeight: '1.5rem',
        color: 'white',
        fontWeight: '100',
        even: {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
      },
      value: {
        textAlign: 'right',
      },
    },
    modeColor: {
      color: '#bdbdbd',
    },
    dividerSplitLine: {
      color: '#bdbdbd',
      '&::before, &::after': {
        borderColor: '#bdbdbd !important',
      },
    },
  }

  const { title, content, subheader } = classes

  return (
    <ThemeProvider theme={theme}>
      <Card elevation={0} css={styles.root}>
        <CardHeader
          avatar={<Avatar css={styles.avatar}>{priority}</Avatar>}
          title={id}
          classes={{ title, content, subheader }}
          css={styles.cardHeader}
        />
        <Divider css={styles.divider} />
        <CardContent css={styles.cardContent}>
          <Divider css={{ ...styles.modeColor, ...styles.dividerSplitLine }}>
            {t('details')}
          </Divider>
          <div css={styles.explainer}>
            {Object.entries(rest).map(([key, value], index) => (
              <div
                key={key}
                css={{
                  ...styles.explainer.line,
                  ...(!(index % 2) && styles.explainer.line.even),
                }}
              >
                <span>{snake2human(key)}:</span>
                <span css={styles.explainer.value}>{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
        {/* <CardActions disableSpacing></CardActions> */}
      </Card>
    </ThemeProvider>
  )
}

export default RequestDetails
