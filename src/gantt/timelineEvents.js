import { select } from '../redux/recommendations'

export const selectRecommendation = dispatch => ({ items }) => {
  const selectedId = items[0]
  dispatch(select(selectedId))
}
