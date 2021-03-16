/** @jsxImportSource @emotion/react */
import { useRef, useEffect } from 'react'

import { DataSet, Timeline } from 'vis-timeline/standalone'
import 'vis-timeline/styles/vis-timeline-graph2d.css'

import useOptions from './useOptions'

const styles = {
  root: theme => ({}),
}

const Gantt = () => {
  const ref = useRef()
  const options = useOptions()

  useEffect(() => {
    const container = ref.current

    const groups = new DataSet([
      { id: '1', content: 'Group 1' },
      { id: '2', content: 'Group 2' },
    ])

    const start = new Date('March 16, 2021 22:00:00')
    const end = new Date('March 16, 2021 23:00:00')

    const items = new DataSet([
      {
        id: 1,
        content: 'item 1',
        title: 'item1 title',
        start,
        end,
        group: '1',
      },
      {
        id: 2,
        content: 'item 6',
        start: Date.now(),
        type: 'point',
        group: '2',
      },
    ])

    // Create a Timeline
    const timeline = new Timeline(container, items, options)
    timeline.setGroups(groups)
  }, [options])

  return <div css={styles.root} ref={ref} />
}

export default Gantt
