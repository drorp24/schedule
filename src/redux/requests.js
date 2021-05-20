import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import requestsApi from '../api/requestsApi'

// * normalization
const requestsAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: (a, b) => Number(b.score) - Number(a.score),
})

// * thunk
export const fetchRequests = createAsyncThunk(
  'requests/fetch',
  async ({ runId, requestsFields }, { rejectWithValue, getState }) => {
    try {
      const response = await requestsApi(runId)
      const requests = response.map(requestsFields)
      return { runId, requests }
    } catch (error) {
      return rejectWithValue(error.toString())
    }
  },
  {
    condition: ({ runId }, { getState }) => {
      const {
        requests: { meta },
      } = getState()
      if (meta?.runId === runId) return false
    },
  }
)

// * reducers / actions
const initialState = requestsAdapter.getInitialState({
  loading: 'idle',
  selectedId: null,
  meta: null,
})

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    clear: () => initialState,
    add: requestsAdapter.addOne,
    update: requestsAdapter.updateOne,
    select: (state, { payload }) => {
      state.selectedId = payload
    },
    error: (state, { payload: error }) => ({ ...state, error }),
  },
  extraReducers: {
    [fetchRequests.pending]: (state, { meta: { requestId } }) => {
      if (state.loading === 'idle') {
        state.currentRequestId = requestId
        state.loading = 'pending'
        state.error = null
      }
    },

    [fetchRequests.fulfilled]: (
      state,
      { meta: { requestId }, payload: { runId, requests } }
    ) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = null
        state.meta = { runId }
        requestsAdapter.setAll(state, requests)
      }
    },

    [fetchRequests.rejected]: (state, { meta: { requestId }, payload }) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = payload
      }
    },
  },
})

// * selectors (partly memoized)
const requestsSelectors = requestsAdapter.getSelectors()

// combine all aspects of entities:
// - createEntityAdapter's memoized sorted entities
// - keyed entities
// - createAsyncThunk's loading/error states as well as my own 'loaded' state
export const selectEntities = ({ requests }) => {
  const sortedEntities = requestsSelectors.selectAll(requests)
  const keyedEntities = requests.entities
  const ids = requestsSelectors.selectIds(requests)
  const { loading, error, selectedId } = requests
  const selectedEntity = keyedEntities[selectedId]
  const isLoading = loading === 'pending'
  const loaded = sortedEntities.length > 0 && loading === 'idle' && !error
  return {
    sortedEntities,
    keyedEntities,
    ids,
    selectedId,
    selectedEntity,
    loading,
    isLoading,
    loaded,
    error,
  }
}

export const selectIds = ({ requests }) => requestsSelectors.selectIds(requests)

export const selectEntityById =
  id =>
  ({ requests }) =>
    requestsSelectors.selectById(requests, id)

export const selectSelectedId = ({ requests: { selectedId } }) => selectedId

export const selectSelectedEntity = ({ requests }) => {
  const { selectedId } = requests
  if (!selectedId) return null

  const selectedEntity = selectEntityById(selectedId)({ requests })

  return { selectedEntity }
}

export const selectLocations = ({ requests }) => {
  const allRequests = requestsSelectors.selectAll(requests)
  if (!allRequests.length) return null
  const locations = []
  allRequests.forEach(({ location }) => {
    if (location.type) locations.push(location)
  })
  return locations
}

const { reducer, actions } = requestsSlice
export const { clear, add, update, select, error } = actions

export default reducer
