import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import zonesApi from '../api_new/zonesApi'
import zonesFields from '../api_new/conversions/zonesFields'

// * normalization
const zonesAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: (a, b) => a.id.localeCompare(b.id),
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
//  - unlike api failures, issues don't require user's attention or developer's bugfix.

// * thunk
export const fetchZones = createAsyncThunk(
  'zones/fetch',
  async ({ runId }, { rejectWithValue }) => {
    try {
      const response = await zonesApi(runId)
      const zones = Object.values(response).map(zonesFields)
      console.log('zones: ', zones)
      return { runId, zones }
    } catch (error) {
      console.error('fetch catch error:', error)
      // xApi throws a POJO, which redux can serialize and I want to record in the error key
      // but failures in the above code will generate an Error type, which redux cannot serialize
      const message = error instanceof Error ? error.message : error
      return rejectWithValue(message)
    }
  },
  {
    // ! Preventing duplicate data fetching
    // 'condition' enables skipping a payload creator's execution and dispatched action.
    // 'meta' holds info that uniquely identifies a specific fetched data (here: its run_id).
    //
    // The code below will prevent re-fetching of data if it already exists,
    // by comparing the zones' runId param with the recorded runId of last succesful fetch.
    //
    // Redundant fetching would otherwise happen if component is re-rendered
    // for reasons such as locale change that trigger an overall rerender.
    condition: ({ runId }, { getState }) => {
      const {
        zones: { meta },
      } = getState()
      if (meta?.runId === runId) return false
    },
  }
)

// * reducers / actions
const initialState = zonesAdapter.getInitialState({
  loading: 'idle',
  selectedId: null,
  meta: null,
  issues: [],
})

const zonesSlice = createSlice({
  name: 'zones',
  initialState,
  reducers: {
    clear: () => initialState,
    add: zonesAdapter.addOne,
    update: zonesAdapter.updateOne,
    select: (state, { payload }) => {
      state.selectedId = payload
    },
    error: (state, { payload: error }) => ({ ...state, error }),
  },
  extraReducers: {
    [fetchZones.pending]: (state, { meta: { requestId } }) => {
      if (state.loading === 'idle') {
        state.currentRequestId = requestId
        state.loading = 'pending'
        state.error = null
      }
    },

    [fetchZones.fulfilled]: (
      state,
      { meta: { requestId }, payload: { runId, zones, issues } }
    ) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = null
        if (issues) state.issues = issues
        state.meta = { runId }
        zonesAdapter.setAll(state, zones)
      }
    },

    [fetchZones.rejected]: (state, { meta: { requestId }, payload }) => {
      console.log('[fetchx.rejected] reached. payload:', payload)
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = payload.toString()
      }
    },
  },
})

// * selectors (partly memoized)
const zonesSelectors = zonesAdapter.getSelectors()

// combine together:
// - createEntityAdapter's memoized sorted entities
// - keyed entities
// - createAsyncThunk's loading/error states as well as my own 'loaded' state
export const selectEntities = ({ zones }) => {
  const sortedEntities = zonesSelectors.selectAll(zones)
  const keyedEntities = zones.entities
  const ids = zonesSelectors.selectIds(zones)
  const { loading, error, selectedId } = zones
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

export const selectIds = ({ zones }) => zonesSelectors.selectIds(zones)

export const selectEntityById =
  id =>
  ({ zones }) =>
    zonesSelectors.selectById(zones, id)

export const selectSelectedId = ({ zones: { selectedId } }) => selectedId

export const selectSelectedEntity = ({ zones }) => {
  const { selectedId } = zones
  if (!selectedId) return null

  const selectedEntity = selectEntityById(selectedId)({ zones })

  return { selectedEntity }
}

export const selectLocations = ({ zones }) => {
  const allZones = zonesSelectors.selectAll(zones)
  if (!allZones.length) return null
  const locations = []
  allZones.forEach(({ location }) => {
    if (location.type) locations.push(location)
  })
  return locations
}

const { reducer, actions } = zonesSlice
export const { clear, add, update, select, error } = actions

export default reducer
