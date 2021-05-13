import { DataSet, Timeline } from 'vis-timeline/standalone'

import {
  selectRecommendation /* , changeDetailsLevel */,
} from './timelineEvents'
// import itemTemplate from './itemTemplate'
import { color } from './config'
import pickNext from '../utility/pickNext'

const createTimeline = ({ container, options, dispatch }) => ({
  recommendations,
}) => {
  let groupsObj = {}
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
        formation_id,
      }) => {
        groupsObj[formation_id] = {
          id: formation_id,
          content: 'Abc',
          title: formation_id,
          className: pickNext(color),
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
          formation_id,
        }
        return {
          id,
          // template: itemTemplate,
          start,
          end,
          group: formation_id,
          formation_id,
          platform_id,
          drone_formation,
          drone_package_config_id,
          fulfills,
        }
      }
    )
  )

  const groups = new DataSet(Object.values(groupsObj))

  const timeline = new Timeline(container, items, options)
  timeline.setGroups(groups)
  timeline.on('select', selectRecommendation(dispatch))
  // timeline.on(
  //   'rangechanged',
  //   changeDetailsLevel({ timeline, recommendationsObj })
  // )
  return timeline
}

export default createTimeline
