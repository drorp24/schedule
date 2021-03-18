import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  // current,
} from '@reduxjs/toolkit'
// import { createSelector } from 'reselect'

import recommendationsApi from '../api/recommendationsApi'

// * normalization
const recommendationsAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: (a, b) =>
    a.platform_id &&
    b.platform_id &&
    typeof a.platform_id === 'string' &&
    typeof b.platform_id === 'string' &&
    a.platform_id.localeCompare(b.platform_id),
})

// * thunk
export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetch',
  async ({ recommendationFields, buildTimeline }, thunkAPI) => {
    try {
      const response = await recommendationsApi(
        'e0e80704-e4d7-45bd-b28f-d51186c9cef6'
      )
      const recommendations = response.map(recommendationFields)
      buildTimeline({ recommendations })
      return { recommendations }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.toString())
    }
  }
)

// * reducers / actions
const initialState = recommendationsAdapter.getInitialState({
  loading: 'idle',
  selected: null,
})

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    clear: () => initialState,
    add: recommendationsAdapter.addOne,
    update: recommendationsAdapter.updateOne,
    error: (state, { payload: error }) => ({ ...state, error }),
  },
  extraReducers: {
    [fetchRecommendations.pending]: (state, { meta: { requestId } }) => {
      if (state.loading === 'idle') {
        state.currentRequestId = requestId
        state.loading = 'pending'
        state.error = null
      }
    },

    [fetchRecommendations.fulfilled]: (
      state,
      { meta: { requestId }, payload: { recommendations } }
    ) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = null
        recommendationsAdapter.setAll(state, recommendations)
      }
    },

    [fetchRecommendations.rejected]: (
      state,
      { meta: { requestId }, payload }
    ) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = payload
      }
    },
  },
})

// * memoized selectors (reselect)
// common selector functions should be defined here rather than in the callers for memoization
const recommendationsSelectors = recommendationsAdapter.getSelectors()

// combine createAsyncThunk's loading/error states with createEntityAdapter's ids/entities join
// 'entities' in this selector are returned as a sorted array rather than keyed
export const selectRecommendations = ({ recommendations }) => {
  const entities = recommendationsSelectors.selectAll(recommendations)
  const { loading, error, selected } = recommendations
  const loaded = entities.length > 0 && loading === 'idle' && !error
  return { entities, selected, loading, error, loaded }
}

// this will return entities keyed, as they naturally appear in redux
// todo: memoize with reselect
export const selectEntities = ({ recommendations: { entities } }) => ({
  entities,
})

export const selectEntityById = id => ({ recommendations }) =>
  recommendationsSelectors.selectById(recommendations, id)

export const selectIds = ({ recommendations }) =>
  recommendationsSelectors.selectIds(recommendations)

export const selectSelectedId = ({ recommendations: { selected } }) => selected

export const selectSelectedEntity = ({ recommendations }) => {
  const { selected } = recommendations
  if (!selected) return null

  const selectedE = selectEntityById(selected)({ recommendations })

  return { selectedE }
}

const { reducer, actions } = recommendationsSlice
export const { clear, add, update, error } = actions

export default reducer
