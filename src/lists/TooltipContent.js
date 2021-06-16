/** @jsxImportSource @emotion/react */
import useTheme from '../styling/useTheme'
import { useLocale, useMode, snake2human } from '../utility/appUtilities'
import excludeKeys from '../utility/excludeKeys'
import useTranslation from '../i18n/useTranslation'
import jsStringify from '../utility/jsStringify'

import { ThemeProvider, makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'

// # TooltipContent
// ? Generic tooltip content that will render any props regardless of entity
// ? as long as it gets the following props object:
//
// ~ entity
//   props of the entity instance being rendered. Must include 'id'
// ~ conf
//   a configuration object with props specific to the given entity such as name and color

const TooltipContent = ({
  entity: { id, ...rest },
  conf: { color, avatar, exclude },
}) => {
  const { direction } = useLocale()
  const { otherMode } = useMode()
  const t = useTranslation()
  const theme = useTheme({ mode: otherMode, direction })
  const fields = excludeKeys({ obj: rest, exclude })
  const inAvatar = rest[avatar] ? rest[avatar] : avatar

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
      color: '#000',
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
          avatar={<Avatar css={styles.avatar}>{inAvatar}</Avatar>}
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
            {Object.entries(fields).map(([key, value], index) => (
              <div
                key={key}
                css={{
                  ...styles.explainer.line,
                  ...(!(index % 2) && styles.explainer.line.even),
                }}
              >
                <span>{snake2human(key)}:</span>
                <span css={styles.explainer.value}>
                  {typeof value === 'object' ? jsStringify(value) : value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
        {/* <CardActions disableSpacing></CardActions> */}
      </Card>
    </ThemeProvider>
  )
}

export default TooltipContent
