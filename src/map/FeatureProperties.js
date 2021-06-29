/** @jsxImportSource @emotion/react */
import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectDeliveriesById } from '../redux/depots'

import { useLocale, useMode } from '../utility/appUtilities'
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
    },
    value: {
      textAlign: 'right',
    },
  }
  return (
    <div
      css={{ ...styles.row, ...(index % 2 ? styles.row.odd : styles.row.even) }}
    >
      <span css={styles.prop}>{prop}</span>
      {value && <span css={styles.value}>{value}</span>}
    </div>
  )
}

const FeatureProperties = ({ properties = {}, entity }) => {
  const { direction } = useLocale()
  const { light } = useMode()
  const t = useTranslation()

  const { requestId, depotId, deliveryId, color: deliveryColor } = properties

  const matched = !!deliveryId

  const { icon, color: unmatchedColor } =
    config[matched ? 'matched' : 'unmatched']
  const color = deliveryColor || unmatchedColor

  const title =
    entity === 'request'
      ? matched
        ? t('matchedReq')
        : t('unmatchedReq')
      : t(entity)

  const subheader = requestId ? requestId.slice(-7) : ''

  const listHeader =
    entity === 'request'
      ? matched
        ? t('matchedData')
        : t('unmatchedData')
      : t(config[entity + 's']?.listheader) // sorry :)

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
      '& + div': {
        marginTop: '5rem',
      },
      '& .MuiCardHeader-title': {
        fontWeight: '700',
        fontSize: '1rem',
      },
    },
    cardContent: {
      direction: 'ltr',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
      marginTop: '0.5rem',
    },
    divider: {
      '&::before': {
        zIndex: '-1',
      },
      '&::after': {
        zIndex: '-1',
      },
    },

    more: {
      position: 'fixed',
      bottom: '1rem',
      width: '100%',
      marginRight: '-1rem',
      fontSize: '1rem',
      textAlign: 'center',
      color,
      direction: 'ltr', // temporary
    },
  }

  return (
    <div css={styles.container} onScroll={handleScroll} ref={ref}>
      <Card elevation={0}>
        <div css={styles.absolute}>
          <CardHeader
            title={title}
            subheader={subheader}
            avatar={<Avatar css={styles.avatar}>{icon}</Avatar>}
            css={styles.header}
          ></CardHeader>
          <Divider>{t(listHeader)}</Divider>
        </div>
        <CardContent css={styles.cardContent}>
          {(entity === 'request' || entity === 'zone') &&
            Object.entries(properties).map(([prop, value], index) => (
              <Row key={prop} {...{ prop, value, index }} />
            ))}
          {entity === 'depot' &&
            Object.entries(depotDeliveryIds).map((prop, index) => (
              <Row key={prop} {...{ prop, index }} />
            ))}
        </CardContent>
        {!bottom && <div css={styles.more}>more...</div>}
      </Card>
    </div>
  )
}

export default FeatureProperties
