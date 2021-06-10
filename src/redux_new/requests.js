import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import requestsApi from '../api/requestsApi'

// * normalization
const requestsAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: (a, b) => {},
})

// !Error handling
// ~ Players
//  There are 3 players in the fetch game:
//  - caller component, via its useEffect
//  - this file's action/payload creator and reducer
//  - the respective xApi file
// ~ Api failures
//  - are identified in the respective xApi,
//  - throw there a POJO object (instead of Error object, which is not redux seralizable)
//  - reach this file's catch clause below
//  - don't reach the [fetchx.fullfilled] below but the [fetchx.rejected] instead
//  - if caller useEffect then wants to know about / react to the error
//    it should call 'unwrapResult' then 'catch',
//    or else the error is handled by [fetchx.rejected] and swallowed there.
//  - either way, [fetchx.rejected] records the error (as a POJO object) in the entity's error key
//  - which gets noticed by useNotification and renders a snackbar to the user.
// ~ Issues
//  - are identified by some post processor,
//  - can be set either in xApi, the fetchx below or the[fetchx.fulfilled].
//  - either way, they should be one of [fetchx.fullfilled]'s arguments,
//    so it can add them to the list of issues on the entity's issues key.
//  - unlike api failures, issues don't require user's attention nor any bugfix.

// * thunk
export const fetchRequests = createAsyncThunk(
  'requests/fetch',
  async ({ runId, requestsFields }, { rejectWithValue }) => {
    try {
      const response = await requestsApi(runId)
      const requests = response.map(requestsFields)
      return { runId, requests }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
  {
    // ! Preventing duplicate data fetching
    // 'condition' enables skipping a payload creator's execution and dispatched action.
    // 'meta' holds info that uniquely identifies a specific fetched data (here: its run_id).
    //
    // The code below will prevent re-fetching of data if it already exists,
    // by comparing the requests' runId param with the recorded runId of last succesful fetch.
    //
    // Redundant fetching would otherwise happen if component is re-rendered
    // for reasons such as locale change that trigger an overall rerender.
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
  issues: [],
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
      { meta: { requestId }, payload: { runId, requests, issues } }
    ) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = null
        if (issues) state.issues = issues
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

// combine together:
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
