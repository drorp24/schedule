/** @jsxImportSource @emotion/react */
import { useRef, useEffect, memo, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRecommendations } from '../redux/recommendations'
import { selectEntities as selectRuns } from '../redux/runs'

import 'vis-timeline/styles/vis-timeline-graph2d.css'
import createTimeline from './createTimeline'
import recommendationFields from './recommendationFields'

import { useLocale } from '../utility/appUtilities'
import { timelineOptions } from './options'
import noScrollbar from '../styling/noScrollbar'
import Progress from '../layout/Progress'
import flight from '../assets/flight.png'

import './gantt.css'
// ToDo next:
// - create a React template for the tooltip (mui's Tooltip)
// - in it, display the volleys hierarchy with mui's Tree, created recursively as in their 'rich' example
// - insert action icons, as in puzzle, one with thumbs-up icon for approval.
// ! - important: redux-persist

const Gantt = () => {
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
      backgroundColor: theme.palette.background.darkerBackdrop,
      overflow: 'scroll',
      ...noScrollbar,
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
      '& .vis-labelset .vis-label, .vis-time-axis .vis-text, .vis-time-axis .vis-text': {
        color: mode === 'light' ? theme.palette.text.primary : '#9e9e9e',
      },
      '& .vis-panel.vis-center, .vis-panel.vis-left, .vis-panel.vis-right, .vis-panel.vis-top, .vis-panel.vis-bottom, .vis-time-axis .vis-grid.vis-minor': {
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
          backgroundColor: '#607d8b !important',
          color: '#fff',
          '& .vis-item-content > div': {
            backgroundColor: '#607d8b !important',
          },
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

  useEffect(() => {
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
        fetchRecommendations({
          runId,
          recommendationFields,
          buildTimeline,
        })
      ).then(() => {
        setLoading(false)
        setTimeout(() => {
          ref.current.scrollTo({
            top: ref.current.scrollHeight,
            behavior: 'smooth',
          })
        }, 0)
      })
    }
  }, [dispatch, options, runId])

  if (loading)
    return (
      <div css={styles.root}>
        <Progress />
      </div>
    )

  return <div css={styles.root} ref={ref} id="gantt" />
}

export default memo(Gantt)
