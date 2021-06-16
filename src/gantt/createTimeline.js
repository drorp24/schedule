import { DataSet, Timeline } from 'vis-timeline/standalone'

import { updateSelected } from './timelineEvents'
// import itemTemplate from './itemTemplate'

const createTimeline =
  ({ container, options, dispatch }) =>
  ({ deliveries }) => {
    const groupsObj = {}
    const deliveryItems = []

    deliveries.forEach(
      ({
        id,
        drone_formation,
        drone_type,
        package_type_amounts,
        max_session_time,
        depart_depot_id,
        arrive_depot_id,
        drone_deliveries,
        color,
      }) => {
        const className = color
        groupsObj[id] = {
          id,
          title: id,
          className,
        }
        drone_deliveries.forEach(
          ({ depart_time, arrive_time, package_delivery_plan_ids }) => {
            deliveryItems.push({
              delivering_drones_id: id,
              start: depart_time,
              end: arrive_time,
              package_delivery_plan_ids,
              drone_formation,
              drone_type,
              package_type_amounts,
              max_session_time,
              depart_depot_id,
              arrive_depot_id,
              drone_deliveries,
              color,
              className,
              group: id,
              // template: itemTemplate,
            })
          }
        )
      }
    )

    const items = new DataSet(deliveryItems)

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
