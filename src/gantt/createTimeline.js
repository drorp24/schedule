import { DataSet, Timeline } from 'vis-timeline/standalone'

import { updateSelected } from './timelineEvents'
// import itemTemplate from './itemTemplate'

const createTimeline =
  ({ container, options, dispatch }) =>
  ({ recommendations }) => {
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
          color,
        }) => {
          const className = color
          groupsObj[formation_id] = {
            id: formation_id,
            content: 'Abc',
            title: formation_id,
            className,
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
            className,
          }
        }
      )
    )

    const groups = new DataSet(Object.values(groupsObj))

    const timeline = new Timeline(container, items, options)
    timeline.setGroups(groups)

    // ! 'select' strange behavior
    // vis-timeline 'select' event provides an array with the up-to-date state of selection.
    // This should have been the easiest most straightforward solution to updating redux.
    // However for some obscure reason, calling dispatch makes select trigger twice, the 2nd time around
    // unselecting the item clicked, rendering 'select' event completely unusable.
    // Therefore I am using 'click' and getSelection instead.
    //
    // timeline.on('select', updateSelected(dispatch))

    timeline.on('click', updateSelected({ dispatch, timeline }))

    // timeline.on(
    //   'rangechanged',
    //   changeDetailsLevel({ timeline, recommendationsObj })
    // )
    return timeline
  }

export default createTimeline
