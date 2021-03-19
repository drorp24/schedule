import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  // current,
} from '@reduxjs/toolkit'
// import { createSelector } from 'reselect'

import requestsApi from '../api/requestsApi'

// * normalization
const requestsAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: (a, b) => Number(b.score) - Number(a.score),
})

// * thunk
export const fetchRequests = createAsyncThunk(
  'requests/fetch',
  async ({ requestsFields }, thunkAPI) => {
    try {
      const response = await requestsApi('e0e80704-e4d7-45bd-b28f-d51186c9cef6')
      const requests = response.map(requestsFields)
      return { requests }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.toString())
    }
  }
)

// * reducers / actions
const initialState = requestsAdapter.getInitialState({
  loading: 'idle',
  selectedId: null,
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
      { meta: { requestId }, payload: { requests } }
    ) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = null
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
  const loaded = sortedEntities.length > 0 && loading === 'idle' && !error
  return {
    sortedEntities,
    keyedEntities,
    ids,
    selectedId,
    loading,
    loaded,
    error,
  }
}

export const selectEntityById = id => ({ requests }) =>
  requestsSelectors.selectById(requests, id)

export const selectSelectedId = ({ requests: { selectedId } }) => selectedId

export const selectSelectedEntity = ({ requests }) => {
  const { selectedId } = requests
  if (!selectedId) return null

  const selectedEntity = selectEntityById(selectedId)({ requests })

  return { selectedEntity }
}

const { reducer, actions } = requestsSlice
export const { clear, add, update, select, error } = actions

export default reducer
