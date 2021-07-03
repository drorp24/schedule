/** @jsxImportSource @emotion/react */
import { useRef, useEffect, memo, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

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
  selectLoaded as selectDeliveriesLoaded,
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
  const ref = useRef()
  const { locale, rtl } = useLocale()
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

  // fetch deliveries
  useEffect(() => {
    console.log('deliveries useEffect entered')
    const container = ref.current
    const buildTimeline = createTimeline({
      container,
      options,
      dispatch,
    })

    if (runId) {
      setLoading(true)
      // force a re-render for an otherwise unchanging DOM element
      if (ref.current) ref.current.innerHTML = ''

      dispatch(
        fetchDeliveries({
          runId,
          buildTimeline,
        })
      ).then(() => {
        setLoading(false)
      })
    }
  }, [dispatch, options, runId])

  // Update effects
  const requestsLoaded = useSelector(selectRequestsLoaded(runId))
  const deliveryPlansLoaded = useSelector(selectDeliveryPlansLoaded(runId))
  const deliveriesLoaded = useSelector(selectDeliveriesLoaded(runId))
  const effectsRecorded = useSelector(selectEffectsRecorded(runId))

  const { requests } = useSelector(selectRequestsEntities)
  const { deliveryPlans } = useSelector(selectDeliveryPlansEntities)

  useEffect(() => {
    if (
      !runId ||
      !deliveriesLoaded ||
      !requestsLoaded ||
      !deliveryPlansLoaded ||
      effectsRecorded
    )
      return

    console.log('Gantt effects useEffect survivied the if')

    dispatch(updateDeliveryEffects({ requests, deliveryPlans }))
  }, [
    runId,
    deliveriesLoaded,
    requestsLoaded,
    deliveryPlansLoaded,
    effectsRecorded,
    requests,
    deliveryPlans,
    dispatch,
  ])

  if (loading)
    return (
      <div css={styles.root}>
        <Progress />
      </div>
    )

  return <div css={styles.root} ref={ref} id="gantt" />
}

export default memo(Gantt)
