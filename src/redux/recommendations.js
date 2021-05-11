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
  async ({ runId, recommendationFields, buildTimeline }, thunkAPI) => {
    try {
      const { response, newFormat } = await recommendationsApi(runId)
      console.clear()
      console.log('response: ', response)
      console.log('newFormat: ', newFormat)
      const recommendations = response.map(recommendationFields)
      const timeline = buildTimeline({ recommendations })
      return { runId, recommendations }
    } catch (error) {
      console.log('error: ', error)
      return thunkAPI.rejectWithValue(error.toString())
    }
  },
  {
    condition: ({ runId, buildTimeline }, { getState }) => {
      const {
        recommendations: { meta, entities },
      } = getState()
      if (meta?.runId === runId) {
        const recommendations = Object.values(entities)
        buildTimeline({ recommendations })
        return false
      }
    },
  }
)

// * reducers / actions
const initialState = recommendationsAdapter.getInitialState({
  loading: 'idle',
  selectedId: null,
  meta: null,
})

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    clear: () => initialState,
    add: recommendationsAdapter.addOne,
    update: recommendationsAdapter.updateOne,
    select: (state, { payload }) => {
      state.selectedId = payload
    },
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
      { meta: { requestId }, payload: { runId, recommendations } }
    ) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = null
        state.meta = { runId }
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

// * selectors (partly memoized)
const recommendationsSelectors = recommendationsAdapter.getSelectors()

// combine all aspects of entities:
// - createEntityAdapter's memoized sorted entities
// - keyed entities
// - createAsyncThunk's loading/error states as well as my own 'loaded' state
export const selectEntities = ({ recommendations }) => {
  const sortedEntities = recommendationsSelectors.selectAll(recommendations)
  const keyedEntities = recommendations.entities
  const ids = recommendationsSelectors.selectIds(recommendations)
  const { loading, error, selectedId } = recommendations
  const loaded = sortedEntities.length > 0 && loading === 'idle' && !error
  return {
    sortedEntities,
    keyedEntities,
    ids,
    selectedId,
    loading,
    error,
    loaded,
  }
}

export const selectEntityById = id => ({ recommendations }) =>
  recommendationsSelectors.selectById(recommendations, id)

export const selectSelectedId = ({ recommendations: { selectedId } }) =>
  selectedId

export const selectSelectedEntity = ({ recommendations }) => {
  const { selectedId } = recommendations
  if (!selectedId) return null

  const selectedEntity = selectEntityById(selectedId)({ recommendations })

  return selectedEntity
}

const { reducer, actions } = recommendationsSlice
export const { clear, add, update, select, error } = actions

export default reducer
