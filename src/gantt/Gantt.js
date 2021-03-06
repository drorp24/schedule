/** @jsxImportSource @emotion/react */
import { useRef, useEffect, memo, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'

import { selectEntities as selectRuns } from '../redux/runs'
import {
  selectEntities as selectRequestsEntities,
  selectLoaded as selectRequestsLoaded,
} from '../redux/requests'
import {
  selectEntities as selectDeliveryPlansEntities,
  selectLoaded as selectDeliveryPlansLoaded,
} from '../redux/deliveryPlans'
import {
  fetchDeliveries,
  selectEffectsRecorded,
  updateDeliveryEffects,
} from '../redux/deliveries'

import 'vis-timeline/styles/vis-timeline-graph2d.css'
import createTimeline from './createTimeline'

import { useLocale } from '../utility/appUtilities'
import { timelineOptions } from './options'
import noScrollbar from '../styling/noScrollbar'
import Progress from '../layout/Progress'
import flight from '../assets/flight.png'

import './gantt.css'

const Gantt = () => {
  console.log('Gantt is rendered')
  const containerRef = useRef()
  const { locale, rtl, antiPlacement, capitalAntiPlacement } = useLocale()
  const options = useMemo(() => timelineOptions({ locale, rtl }), [locale, rtl])
  const mode = useSelector(store => store.app.mode)
  const { selectedId: runId } = useSelector(selectRuns)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const styles = {
    root: theme => ({
      height: '100%',
      overflow: 'scroll',
      ...noScrollbar,
      '& .vis-delete-rtl': {
        display: 'none',
      },
      '& .vis-tooltip': {
        direction: 'ltr',
      },
      '& .vis-panel.vis-bottom': {
        fontSize: '0.75rem',
        fontWeight: 900,
      },
      '& .vis-timeline': {
        border: 'none',
      },
      '& .vis-time-axis.vis-foreground': {
        position: 'fixed',
        top: '60vh',
        [antiPlacement]: 'calc(4rem + 0.3 * (100vw - 4rem) - 5px)',
        width: 'calc(100vw - 4rem - 0.3 * (100vw - 4rem) + 5px)',
        [`padding${capitalAntiPlacement}`]: '2rem',
        zIndex: 401,
        height: '2rem !important',
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.9rem',
        borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
      },
      '& .vis-labelset': {
        // width: '1.5rem',
      },
      '& .vis-labelset .vis-label, .vis-time-axis .vis-text, .vis-time-axis .vis-text':
        {
          color: mode === 'light' ? theme.palette.text.primary : '#9e9e9e',
          fontWeight: 400,
        },
      '& .vis-panel.vis-center, .vis-panel.vis-left, .vis-panel.vis-right, .vis-panel.vis-top, .vis-panel.vis-bottom, .vis-time-axis .vis-grid.vis-minor':
        {
          borderColor: '#616161',
        },
      '& .vis-labelset .vis-label.draggable': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        '& .vis-inner': {
          fontSize: '0.5rem',
          whiteSpace: 'nowrap',
          background: `url(${flight}) no-repeat center center`,
          backgroundSize: 'contain',
          transform: 'scaleX(-1)',
          color: 'transparent',
        },
      },
      '& .vis-item': {
        height: '1rem',
        border: '1px solid transparent',
        fontSize: '0.85rem',
        '&.vis-selected': {
          // animation: 'highlight 3s infinite',
          // boxSizing: 'content-box',
          border: '4px solid black',
        },
        '& .vis-item-overflow': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        },
        '& svg': {
          fontSize: '1.2rem',
        },
        '& .vis-item-content': {
          width: '100%',
          padding: 0,
        },
      },
    }),
  }

  const requestsLoaded = useSelector(selectRequestsLoaded(runId))
  const deliveryPlansLoaded = useSelector(selectDeliveryPlansLoaded(runId))
  const effectsRecorded = useSelector(selectEffectsRecorded(runId))

  const { requests } = useSelector(selectRequestsEntities)
  const { deliveryPlans } = useSelector(selectDeliveryPlansEntities)
  const localeRef = useRef()

  // fetch deliveries

  useEffect(() => {
    if (
      !runId ||
      !requestsLoaded ||
      !deliveryPlansLoaded ||
      (effectsRecorded && locale === localeRef.current?.locale) ||
      !containerRef.current
    )
      return

    const container = containerRef.current
    localeRef.current = { locale }

    const buildTimeline = createTimeline({
      container,
      options,
      dispatch,
    })

    if (runId) {
      setLoading(true)

      dispatch(
        fetchDeliveries({
          runId,
          buildTimeline,
        })
      )
        .then(unwrapResult)
        .then(() => {
          dispatch(updateDeliveryEffects({ requests, deliveryPlans }))
          setLoading(false)
        })
        .catch(error => console.error(error))
    }
  }, [
    dispatch,
    options,
    runId,
    deliveryPlansLoaded,
    effectsRecorded,
    requests,
    deliveryPlans,
    locale,
    requestsLoaded,
  ])

  if (loading)
    return (
      <div css={styles.root}>
        <Progress />
      </div>
    )

  return <div css={styles.root} ref={containerRef} id="gantt" />
}

export default memo(Gantt)
