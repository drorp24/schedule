/** @jsxImportSource @emotion/react */
import { useRef, useEffect, memo } from 'react'
import { useSelector } from 'react-redux'

import { DataSet, Timeline } from 'vis-timeline/standalone'
import 'vis-timeline/styles/vis-timeline-graph2d.css'

import useOptions from './useOptions'
import scheduleApi from '../api/scheduleApi'
import noScrollbar from '../styling/noScrollbar'

// ToDo next:
// - create a React template for the tooltip (mui's Tooltip)
// - in it, display the volleys hierarchy with mui's Tree, created recursively as in their 'rich' example
// - insert action icons, as in puzzle, one with thumbs-up icon for approval.

const Gantt = memo(() => {
  const ref = useRef()
  const options = useOptions()
  const { mode } = useSelector(store => store.app)

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
    }),
  }

  useEffect(() => {
    const container = ref.current

    const groups = new DataSet([
      { id: '1', content: 'type_1' },
      { id: '4', content: 'type_4' },
    ])

    scheduleApi('e0e80704-e4d7-45bd-b28f-d51186c9cef6').then(
      recommendations => {
        const items = new DataSet(
          recommendations.map(
            ({
              id,
              estimated_start_activity: start,
              estimated_end_activity: end,
              start_date,
              platform_id,
            }) => ({
              id,
              content: start_date.slice(-8),
              start,
              end,
              group: platform_id.slice(-1).toString(),
            })
          )
        )

        const timeline = new Timeline(container, items, options)
        timeline.setGroups(groups)
      }
    )
  }, [options])

  return <div css={styles.root} ref={ref} />
})

export default Gantt
