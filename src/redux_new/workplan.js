import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  current,
} from '@reduxjs/toolkit'

import workPlanApi from '../api_new/workPlanApi'

// * normalization
const workPlanAdapter = createEntityAdapter({
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
export const fetchWorkplan = createAsyncThunk(
  'workPlan/fetch',
  async ({ runId, workPlanFields }, { rejectWithValue }) => {
    try {
      const response = await workPlanApi(runId)
      const workPlan = response.map(workPlanFields)
      return { runId, workPlan }
    } catch (error) {
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
    // by comparing the workPlan' runId param with the recorded runId of last succesful fetch.
    //
    // Redundant fetching would otherwise happen if component is re-rendered
    // for reasons such as locale change that trigger an overall rerender.
    condition: ({ runId }, { getState }) => {
      const {
        workPlan: { meta },
      } = getState()
      if (meta?.runId === runId) return false
    },
  }
)

// * reducers / actions
const initialState = workPlanAdapter.getInitialState({
  meta: null,
  loading: 'idle',
  issues: [],
  selectedIds: [],
})

const workPlanSlice = createSlice({
  name: 'workPlan',
  initialState,
  reducers: {
    clear: () => initialState,
    add: workPlanAdapter.addOne,
    update: workPlanAdapter.updateOne,
    selectOne: (state, { payload }) => ({
      ...state,
      selectedIds: current(state).selectedIds.includes(payload)
        ? []
        : [payload],
    }),
    selectMulti: (state, { payload }) => {
      const currentIds = new Set(current(state).selectedIds)
      currentIds.has(payload)
        ? currentIds.delete(payload)
        : currentIds.add(payload)
      state.selectedIds = [...currentIds]
    },
    error: (state, { payload: error }) => ({ ...state, error }),
  },
  extraReducers: {
    [fetchWorkplan.pending]: (state, { meta: { requestId } }) => {
      if (state.loading === 'idle') {
        state.currentRequestId = requestId
        state.loading = 'pending'
        state.error = null
      }
    },

    [fetchWorkplan.fulfilled]: (
      state,
      { meta: { requestId }, payload: { runId, workPlan, issues } }
    ) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = null
        if (issues) state.issues = issues
        state.meta = { runId }
        workPlanAdapter.setAll(state, workPlan)
      }
    },

    [fetchWorkplan.rejected]: (
      state,
      { meta: { requestId }, payload, error }
    ) => {
      console.error('fetchWorkPlan Rejected:')
      if (error?.message) console.error(error.message)
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = payload
      }
    },
  },
})

// * selectors (partly memoized)
const workPlanSelectors = workPlanAdapter.getSelectors()

// combine together:
// - createEntityAdapter's memoized sorted entities
// - keyed entities
// - createAsyncThunk's loading/error states as well as my own 'loaded' state
export const selectEntities = ({ workPlan }) => {
  const sortedEntities = workPlanSelectors.selectAll(workPlan)
  const keyedEntities = workPlan.entities
  const ids = workPlanSelectors.selectIds(workPlan)
  const { loading, error, selectedIds } = workPlan
  const selectedEntities = selectedIds.map(id => keyedEntities[id])
  const isLoading = loading === 'pending'
  const loaded = sortedEntities.length > 0 && loading === 'idle' && !error
  return {
    sortedEntities,
    keyedEntities,
    ids,
    selectedIds,
    selectedEntities,
    loading,
    isLoading,
    loaded,
    error,
  }
}

export const selectIds = ({ workPlan }) => workPlanSelectors.selectIds(workPlan)

export const selectEntityById =
  id =>
  ({ workPlan }) =>
    workPlanSelectors.selectById(workPlan, id)

export const selectSelectedId = ({ workPlan: { selectedId } }) => selectedId

export const selectSelectedEntity = ({ workPlan }) => {
  const { selectedId } = workPlan
  if (!selectedId) return null

  const selectedEntity = selectEntityById(selectedId)({ workPlan })

  return { selectedEntity }
}

export const selectLocations = ({ workPlan }) => {
  const allWorkplan = workPlanSelectors.selectAll(workPlan)
  if (!allWorkplan.length) return null
  const locations = []
  allWorkplan.forEach(({ location }) => {
    if (location.type) locations.push(location)
  })
  return locations
}

const { reducer, actions } = workPlanSlice
export const { clear, add, update, selectOne, selectMulti, error } = actions

export default reducer
