import { select } from '../redux/recommendations'
import itemTemplate from './itemTemplate'
import platforms from './platforms'

export const selectRecommendation = dispatch => ({ items }) => {
  const selectedId = items[0]
  dispatch(select(selectedId))
}

export const changeDetailsLevel = ({ timeline, recommendationsObj }) => ({
  start,
  end,
}) => {
  const visibleItems = timeline?.getVisibleItems()
  if (!visibleItems) return
  const granular = end - start < 7200000

  visibleItems.forEach(id => {
    const {
      start_date,
      platform_id,
      drone_formation,
      drone_package_config_id,
    } = recommendationsObj[id]

    const itemEl = document.querySelector(`[data-id='${id}']`)
    const contentEl = itemEl.querySelector('.vis-item-content')
    if (!contentEl) {
      console.log('no contentEl for:')
      console.log('itemEl: ', itemEl)
      return
    }

    const { backgroundColor, borderColor } = platforms[platform_id]
    itemEl.style.backgroundColor = backgroundColor
    itemEl.style.borderColor = borderColor

    contentEl.style.display = 'flex'
    contentEl.style.flexDirection = 'row'
    contentEl.style.justifyContent = 'center'
    contentEl.style.alignItems = 'center'

    contentEl.innerHTML = itemTemplate(
      {
        start_date,
        platform_id,
        drone_formation,
        drone_package_config_id,
      },
      undefined,
      undefined,
      granular
    )
    // timeline.redraw()
  })
}
