/** @jsxImportSource @emotion/react */
import { useRef, useEffect, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRecommendations } from '../redux/recommendations'

import 'vis-timeline/styles/vis-timeline-graph2d.css'
import createTimeline from './createTimeline'
import recommendationFields from './recommendationFields'

import useOptions from './useOptions'
import noScrollbar from '../styling/noScrollbar'

// ToDo next:
// - create a React template for the tooltip (mui's Tooltip)
// - in it, display the volleys hierarchy with mui's Tree, created recursively as in their 'rich' example
// - insert action icons, as in puzzle, one with thumbs-up icon for approval.
// ! - important: redux-persist

const Gantt = () => {
  const ref = useRef()
  const options = useOptions()
  const mode = useSelector(store => store.app.mode)
  const dispatch = useDispatch()

  const styles = {
    root: theme => ({
      height: '100%',
      backgroundColor: mode === 'light' ? 'white' : 'rgba(256, 256, 256, 0.05)',
      overflow: 'scroll',
      ...noScrollbar,
      '& .vis-timeline': {
        border: 'none',
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
          transform: 'rotate(270deg)',
          textTransform: 'uppercase',
        },
      },
      '& .vis-item': {
        height: '2rem',
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
    dispatch(fetchRecommendations({ recommendationFields, buildTimeline }))
  }, [dispatch, options])

  return <div css={styles.root} ref={ref} />
}

export default memo(Gantt)
