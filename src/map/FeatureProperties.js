/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectDeliveriesById } from '../redux/depots'

import { useLocale, useMode, camel2human } from '../utility/appUtilities'
import useTranslation from '../i18n/useTranslation'
import noScrollbar from '../styling/noScrollbar'
import { atScrollBottom } from '../utility/scrollPositions'
import config from '../lists/config'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'
import grey from '@material-ui/core/colors/grey'

const Row = ({ prop, value, index }) => {
  const styles = {
    row: {
      width: '100%',
      height: '2.5rem',
      padding: '0 0.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      odd: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      },
      even: {},
    },
    prop: {
      textAlign: 'left',
      fontWeight: 700,
    },
    value: {
      textAlign: 'right',
    },
  }
  return (
    <div
      css={{ ...styles.row, ...(index % 2 ? styles.row.odd : styles.row.even) }}
    >
      <span css={styles.prop}>{value ? camel2human(prop) : prop}</span>
      {value && <span css={styles.value}>{value}</span>}
    </div>
  )
}

const FeatureProperties = ({ properties = {}, entities }) => {
  const { direction } = useLocale()
  const { light } = useMode()
  const t = useTranslation()

  const { requestId, depotId, deliveryId, color: deliveryColor } = properties

  const matched = !!deliveryId

  let icon, color
  if (entities === 'requests') {
    const configEntry = config[matched ? 'matched' : 'unmatched']
    icon = configEntry.icon
    color = deliveryColor || configEntry.color
  } else {
    icon = config[entities].icon
    color = config[entities].color
  }

  const title =
    entities === 'requests'
      ? matched
        ? t('matchedReq')
        : t('unmatchedReq')
      : t(config[entities].popupTitle)

  const subheader = requestId ? requestId.slice(-7) : ''

  const listHeader =
    entities === 'requests'
      ? matched
        ? t('matchedData')
        : t('unmatchedData')
      : t(config[entities].listheader)

  const depotDeliveryIds = useSelector(selectDeliveriesById(depotId))

  const [bottom, setBottom] = useState()
  const ref = useRef()
  const handleScroll = () => {
    if (!ref.current) return
    setBottom(atScrollBottom(ref.current))
  }

  const styles = {
    container: {
      direction,
      maxHeight: '35vh',
      minWidth: '20vw',
      overflow: 'scroll',
      ...noScrollbar,
    },
    avatar: {
      backgroundColor: `${color} !important`,
      color: '#fff',
    },
    header: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '5rem',
      backgroundColor: light ? grey[400] : grey[900],
      borderRadius: '5px',
      zIndex: 1,
      marginTop: '-0.5rem',
      '& .MuiCardHeader-title': {
        fontWeight: '700',
        fontSize: '1rem',
      },
    },
    cardContent: {
      direction: 'ltr',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
      marginTop: '6.7rem',
      padding: 0,
      '&:last-child': {
        paddingBottom: 0,
      },
    },
    divider: theme => ({
      position: 'absolute',
      width: '100%',
      top: '4.5rem',
      padding: '0.5rem 0',
      backgroundColor: theme.palette.background.paper,
    }),

    more: {
      direction: 'rtl',
      position: 'fixed',
      bottom: '1rem',
      width: '100%',
      marginRight: '-1rem',
      fontSize: '1rem',
      textAlign: 'center',
      color,
    },
  }

  useEffect(() => {
    if (!ref.current) return
    setBottom(atScrollBottom(ref.current))
  }, [])

  return (
    <div css={styles.container} onScroll={handleScroll} ref={ref}>
      <Card elevation={0}>
        <CardHeader
          title={title}
          subheader={subheader}
          avatar={<Avatar css={styles.avatar}>{icon}</Avatar>}
          css={styles.header}
        ></CardHeader>
        <Divider css={styles.divider}>{listHeader}</Divider>
        <CardContent css={styles.cardContent}>
          {(entities === 'requests' || entities === 'zones') &&
            Object.entries(properties).map(([prop, value], index) => (
              <Row key={prop} {...{ prop, value, index }} />
            ))}
          {entities === 'depots' &&
            Object.entries(depotDeliveryIds).map((prop, index) => (
              <Row key={prop} {...{ prop, index }} />
            ))}
        </CardContent>
        {!bottom && <div css={styles.more}>{t('scrollForMore')}</div>}
      </Card>
    </div>
  )
}

export default FeatureProperties
