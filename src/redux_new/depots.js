import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import depotsApi from '../api/depotsApi'

// * normalization
const depotsAdapter = createEntityAdapter({
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
export const fetchDepots = createAsyncThunk(
  'depots/fetch',
  async ({ runId, depotsFields }, { rejectWithValue }) => {
    try {
      const response = await depotsApi(runId)
      const depots = response.map(depotsFields)
      return { runId, depots }
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
    // by comparing the depots' runId param with the recorded runId of last succesful fetch.
    //
    // Redundant fetching would otherwise happen if component is re-rendered
    // for reasons such as locale change that trigger an overall rerender.
    condition: ({ runId }, { getState }) => {
      const {
        depots: { meta },
      } = getState()
      if (meta?.runId === runId) return false
    },
  }
)

// * reducers / actions
const initialState = depotsAdapter.getInitialState({
  loading: 'idle',
  selectedId: null,
  meta: null,
  issues: [],
})

const depotsSlice = createSlice({
  name: 'depots',
  initialState,
  reducers: {
    clear: () => initialState,
    add: depotsAdapter.addOne,
    update: depotsAdapter.updateOne,
    select: (state, { payload }) => {
      state.selectedId = payload
    },
    error: (state, { payload: error }) => ({ ...state, error }),
  },
  extraReducers: {
    [fetchDepots.pending]: (state, { meta: { requestId } }) => {
      if (state.loading === 'idle') {
        state.currentRequestId = requestId
        state.loading = 'pending'
        state.error = null
      }
    },

    [fetchDepots.fulfilled]: (
      state,
      { meta: { requestId }, payload: { runId, depots, issues } }
    ) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = null
        if (issues) state.issues = issues
        state.meta = { runId }
        depotsAdapter.setAll(state, depots)
      }
    },

    [fetchDepots.rejected]: (state, { meta: { requestId }, payload }) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = payload
      }
    },
  },
})

// * selectors (partly memoized)
const depotsSelectors = depotsAdapter.getSelectors()

// combine together:
// - createEntityAdapter's memoized sorted entities
// - keyed entities
// - createAsyncThunk's loading/error states as well as my own 'loaded' state
export const selectEntities = ({ depots }) => {
  const sortedEntities = depotsSelectors.selectAll(depots)
  const keyedEntities = depots.entities
  const ids = depotsSelectors.selectIds(depots)
  const { loading, error, selectedId } = depots
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

export const selectIds = ({ depots }) => depotsSelectors.selectIds(depots)

export const selectEntityById =
  id =>
  ({ depots }) =>
    depotsSelectors.selectById(depots, id)

export const selectSelectedId = ({ depots: { selectedId } }) => selectedId

export const selectSelectedEntity = ({ depots }) => {
  const { selectedId } = depots
  if (!selectedId) return null

  const selectedEntity = selectEntityById(selectedId)({ depots })

  return { selectedEntity }
}

export const selectLocations = ({ depots }) => {
  const allDepots = depotsSelectors.selectAll(depots)
  if (!allDepots.length) return null
  const locations = []
  allDepots.forEach(({ location }) => {
    if (location.type) locations.push(location)
  })
  return locations
}

const { reducer, actions } = depotsSlice
export const { clear, add, update, select, error } = actions

export default reducer
