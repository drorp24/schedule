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
      const response = await recommendationsApi(runId)
      const recommendations = response.map(recommendationFields)
      /* const timeline = */ buildTimeline({ recommendations })
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
  selectedIds: [],
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
      state.selectedIds = [payload]
    },
    addToSelection: (state, { payload }) => {
      const currentSelectionSet = new Set(state.selectedIds)
      state.selectedIds = [...currentSelectionSet.add(payload)]
    },
    updateSelection: (state, { payload }) => {
      state.selectedIds = payload
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
// Using createEntityAdapter's so-called simple selectors to gain access to more than one store slice
const recommendationsSelectors = recommendationsAdapter.getSelectors()

// combine all aspects of entities:
// - createEntityAdapter's memoized sorted entities
// - keyed entities
// - createAsyncThunk's loading/error states as well as my own 'loaded' state
export const selectEntities = ({ recommendations }) => {
  const sortedEntities = recommendationsSelectors.selectAll(recommendations)
  const keyedEntities = recommendations.entities
  const ids = recommendationsSelectors.selectIds(recommendations)
  const { loading, error, selectedIds } = recommendations
  const loaded = sortedEntities.length > 0 && loading === 'idle' && !error
  return {
    sortedEntities,
    keyedEntities,
    ids,
    selectedIds,
    loading,
    error,
    loaded,
  }
}

export const selectIds = ({ recommendations }) =>
  recommendationsSelectors.selectIds(recommendations)

export const selectEntityById =
  id =>
  ({ recommendations }) =>
    recommendationsSelectors.selectById(recommendations, id)

export const selectLocationsById =
  id =>
  ({ recommendations, requests }) => {
    const entity = recommendationsSelectors.selectById(recommendations, id)
    if (!entity) return console.error('No entity for id ', id)

    const locations = []
    const { fulfills } = entity
    if (!fulfills?.length) return null

    fulfills.forEach(({ delivery_request_id }) => {
      locations.push(requests.entities[delivery_request_id]?.location)
    })

    return locations
  }

export const selectSelectedIds = ({ recommendations: { selectedIds } }) =>
  selectedIds

export const selectSelectedEntities = ({
  recommendations,
  requests,
  resources,
}) => {
  const { selectedIds } = recommendations
  if (!selectedIds?.length) return { selectedIds }

  const selectedRecs = recommendationsSelectors
    .selectAll(recommendations)
    .filter(({ id }) => selectedIds.includes(id))

  // ToDo: Acquire foreign key from recommendation into employed resource, this is fake
  const resEmployed = {}

  selectedRecs.forEach(({ employs, color }) => {
    if (!employs) return
    const { platform_id } = employs
    if (!platform_id) return
    Object.values(resources.entities).forEach(({ id, drone_loading_dock }) => {
      if (!drone_loading_dock) return
      const { name, drone_type } = drone_loading_dock
      // ToDo: Remove. Demo only
      const fake_platform_id = 'drone_loading_dock_2-drone_type_4'
      // ToDo: Remove. Demo only
      if (`${name}-${drone_type}` === fake_platform_id) resEmployed[id] = color
    })
  })

  const reqFulfilled = {}
  const reqLocations = []
  const reqDropPoints = []

  selectedRecs.forEach(({ fulfills, color }) => {
    fulfills?.length &&
      fulfills.forEach(({ delivery_request_id }) => {
        reqFulfilled[delivery_request_id] = color
        const request = requests.entities[delivery_request_id]
        if (!request) return console.error('No request ', delivery_request_id)
        if (request.location?.type)
          reqLocations.push({ ...request.location, color })
        if (request.dropPoints?.length)
          request.dropPoints.forEach(point =>
            reqDropPoints.push({ ...point, color })
          )
      })
  })

  return {
    selectedIds,
    selectedRecs,
    resEmployed,
    reqFulfilled,
    reqLocations,
    reqDropPoints,
  }
}

// export const selectSelectedLocations = ({ recommendations, requests }) => {
//   const { selectedId } = recommendations
//   if (!selectedId) return null

//   const selectedEntity = selectEntityById(selectedId)({ recommendations })
//   if (!selectedEntity) return null

//   const locations = []
//   const { fulfills } = selectedEntity
//   if (!fulfills?.length) return null

//   fulfills.forEach(({ delivery_request_id }) => {
//     locations.push(requests.entities[delivery_request_id]?.location)
//   })

//   return locations
// }

const { reducer, actions } = recommendationsSlice
export const {
  clear,
  add,
  update,
  select,
  addToSelection,
  updateSelection,
  error,
} = actions

export default reducer
