import { DataSet, Timeline } from 'vis-timeline/standalone'

import { selectRecommendation } from './timelineEvents'

const createTimeline = ({ container, options, dispatch }) => ({
  recommendations,
}) => {
  let plaformsObj = {}

  const items = new DataSet(
    recommendations.map(
      ({
        id,
        estimated_start_activity: start,
        estimated_end_activity: end,
        start_date,
        platform_id,
      }) => {
        plaformsObj[platform_id] = {
          id: platform_id,
          content: platform_id.slice(-6),
        }
        return {
          id,
          content: start_date.slice(-8),
          start,
          end,
          group: platform_id,
        }
      }
    )
  )

  const groups = new DataSet(Object.values(plaformsObj))

  const timeline = new Timeline(container, items, options)
  timeline.setGroups(groups)
  timeline.on('select', selectRecommendation(dispatch))
  return timeline
}

export default createTimeline
