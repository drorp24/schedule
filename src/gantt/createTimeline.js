import { DataSet, Timeline } from 'vis-timeline/standalone'

import { selectRecommendation, changeDetailsLevel } from './timelineEvents'
import itemTemplate from './itemTemplate'
import { humanize } from '../utility/appUtilities'

const createTimeline = ({ container, options, dispatch }) => ({
  recommendations,
}) => {
  let plaformsObj = {}
  let recommendationsObj = {}

  const items = new DataSet(
    recommendations.map(
      ({
        id,
        estimated_start_activity: start,
        estimated_end_activity: end,
        start_date,
        platform_id,
        drone_formation,
        drone_package_config_id,
        fulfills,
      }) => {
        plaformsObj[platform_id] = {
          id: platform_id,
          content: humanize(platform_id.slice(-6)),
        }
        recommendationsObj[id] = {
          id,
          estimated_start_activity: start,
          estimated_end_activity: end,
          start_date,
          platform_id,
          drone_formation,
          drone_package_config_id,
          fulfills,
        }
        return {
          id,
          template: itemTemplate,
          start,
          end,
          group: platform_id,
          platform_id,
          drone_formation,
          drone_package_config_id,
          title: `<div>drone formation: ${drone_formation}</div>`,
          fulfills,
        }
      }
    )
  )

  const groups = new DataSet(Object.values(plaformsObj))

  const timeline = new Timeline(container, items, options)
  timeline.setGroups(groups)
  timeline.on('select', selectRecommendation(dispatch))
  timeline.on(
    'rangechanged',
    changeDetailsLevel({ timeline, recommendationsObj })
  )
  return timeline
}

export default createTimeline
