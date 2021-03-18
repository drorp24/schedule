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
  sortComparer: (a, b) => {},
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
  selected: null,
})

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    clear: () => initialState,
    add: requestsAdapter.addOne,
    update: requestsAdapter.updateOne,
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

// * memoized selectors (reselect)
// common selector functions should be defined here rather than in the callers for memoization
const requestsSelectors = requestsAdapter.getSelectors()

// combine createAsyncThunk's loading/error states with createEntityAdapter's ids/entities join
// 'entities' in this selector are returned as a sorted array rather than keyed
export const selectRequests = ({ requests }) => {
  const entities = requestsSelectors.selectAll(requests)
  const { loading, error, selected } = requests
  const loaded = entities.length > 0 && loading === 'idle' && !error
  return { entities, selected, loading, error, loaded }
}

// this will return entities keyed, as they naturally appear in redux
// todo: memoize with reselect
export const selectEntities = ({ requests: { entities } }) => ({
  entities,
})

export const selectEntityById = id => ({ requests }) =>
  requestsSelectors.selectById(requests, id)

export const selectIds = ({ requests }) => requestsSelectors.selectIds(requests)

export const selectSelectedId = ({ requests: { selected } }) => selected

export const selectSelectedEntity = ({ requests }) => {
  const { selected } = requests
  if (!selected) return null

  const selectedE = selectEntityById(selected)({ requests })

  return { selectedE }
}

const { reducer, actions } = requestsSlice
export const { clear, add, update, error } = actions

export default reducer
