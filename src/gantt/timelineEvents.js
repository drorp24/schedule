import store from '../redux/store'
import { updateSelection } from '../redux/deliveries'

export const updateSelected =
  ({ dispatch, timeline }) =>
  ({ item }) => {
    setTimeout(() => {
      const selection = timeline.getSelection()
      const { requests } = store.getState()
      dispatch(updateSelection({ selection, requests }))
    }, 0)
  }

// * Change detail level according to zoom. Left here for future use.
// export const changeDetailsLevel = ({ timeline, recommendationsObj }) => ({
//   start,
//   end,
// }) => {
//   if (!timeline) {
//     console.error('No timeline')
//     return
//   }
//   const visibleItems = timeline.getVisibleItems()
//   if (!visibleItems) {
//     console.error('No visibleItems')
//     return
//   }
//   const granular = end - start < 7200000

//   visibleItems.forEach(id => {
//     const {
//       start_date,
//       platform_id,
//       drone_formation,
//       drone_package_config_id,
//     } = recommendationsObj[id] || {}

//     const itemEl = document.querySelector(`[data-id='${id}']`)
//     if (!itemEl) {
//       console.error(`no itemEl for id ${id}`)
//       return
//     }
//     const contentEl = itemEl.querySelector('.vis-item-content')
//     if (!contentEl) {
//       console.error('no contentEl for:')
//       console.error('itemEl: ', itemEl)
//       return
//     }

//     contentEl.style.display = 'flex'
//     contentEl.style.flexDirection = 'row'
//     contentEl.style.justifyContent = 'center'
//     contentEl.style.alignItems = 'center'

//     // contentEl.innerHTML = itemTemplate(
//     //   {
//     //     start_date,
//     //     platform_id,
//     //     drone_formation,
//     //     drone_package_config_id,
//     //   },
//     //   undefined,
//     //   undefined,
//     //   granular
//     // )
//     // timeline.redraw()
//   })
// }
