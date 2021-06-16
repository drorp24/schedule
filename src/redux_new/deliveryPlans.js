import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  current,
} from '@reduxjs/toolkit'

import deliveryPlansApi from '../api_new/deliveryPlansApi'
import deliveryPlansFields from '../api_new/conversions/deliveryPlansFields'

// * normalization
const deliveryPlansAdapter = createEntityAdapter({
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
export const fetchDeliveryPlans = createAsyncThunk(
  'deliveryPlans/fetch',
  async ({ runId }, { rejectWithValue }) => {
    try {
      console.log('2. fetchDeliveryPlans entered')
      const response = await deliveryPlansApi(runId)
      const deliveryPlans = Object.values(response).map(deliveryPlansFields)
      return { runId, deliveryPlans }
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
    // by comparing the deliveryPlans' runId param with the recorded runId of last succesful fetch.
    //
    // Redundant fetching would otherwise happen if component is re-rendered
    // for reasons such as locale change that trigger an overall rerender.
    condition: ({ runId }, { getState }) => {
      const {
        deliveryPlans: { meta },
      } = getState()
      console.group('dup fetch prevention')
      console.log('1. condition: meta?.runId, runId: ', meta?.runId, runId)
      if (meta?.runId === runId) return false
    },
  }
)

// * reducers / actions
const initialState = deliveryPlansAdapter.getInitialState({
  meta: null,
  loading: 'idle',
  issues: [],
  selectedIds: [],
})

const deliveryPlansSlice = createSlice({
  name: 'deliveryPlans',
  initialState,
  reducers: {
    clear: () => initialState,
    add: deliveryPlansAdapter.addOne,
    update: deliveryPlansAdapter.updateOne,
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
    [fetchDeliveryPlans.pending]: (state, { meta: { deliveryPlanId } }) => {
      if (state.loading === 'idle') {
        state.currentDeliveryPlanId = deliveryPlanId
        state.loading = 'pending'
        state.error = null
      }
    },

    [fetchDeliveryPlans.fulfilled]: (
      state,
      { meta: { deliveryPlanId }, payload: { runId, deliveryPlans, issues } }
    ) => {
      if (
        state.loading === 'pending' &&
        state.currentdeliveryPlanId === deliveryPlanId
      ) {
        state.currentDeliveryPlanId = undefined
        state.loading = 'idle'
        state.error = null
        if (issues) state.issues = issues
        state.meta = { runId }
        deliveryPlansAdapter.setAll(state, deliveryPlans)
      }
    },

    [fetchDeliveryPlans.rejected]: (
      state,
      { meta: { deliveryPlanId }, payload, error }
    ) => {
      console.error('fetchDeliveryPlans Rejected:')
      if (error?.message) console.error(error.message)
      if (
        state.loading === 'pending' &&
        state.currentDeliveryPlanId === deliveryPlanId
      ) {
        state.currentdeliveryPlanId = undefined
        state.loading = 'idle'
        state.error = payload
      }
    },
  },
})

// * selectors (partly memoized)
const deliveryPlansSelectors = deliveryPlansAdapter.getSelectors()

// combine together:
// - createEntityAdapter's memoized sorted entities
// - keyed entities
// - createAsyncThunk's loading/error states as well as my own 'loaded' state
export const selectEntities = ({ deliveryPlans }) => {
  const sortedEntities = deliveryPlansSelectors.selectAll(deliveryPlans)
  const keyedEntities = deliveryPlans.entities
  const ids = deliveryPlansSelectors.selectIds(deliveryPlans)
  const { loading, error, selectedIds } = deliveryPlans
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

export const selectIds = ({ deliveryPlans }) =>
  deliveryPlansSelectors.selectIds(deliveryPlans)

export const selectEntityById =
  id =>
  ({ deliveryPlans }) =>
    deliveryPlansSelectors.selectById(deliveryPlans, id)

export const selectSelectedId = ({ deliveryPlans: { selectedId } }) =>
  selectedId

export const selectSelectedEntity = ({ deliveryPlans }) => {
  const { selectedId } = deliveryPlans
  if (!selectedId) return null

  const selectedEntity = selectEntityById(selectedId)({ deliveryPlans })

  return { selectedEntity }
}

export const selectLocations = ({ deliveryPlans }) => {
  const alldeliveryPlans = deliveryPlansSelectors.selectAll(deliveryPlans)
  if (!alldeliveryPlans.length) return null
  const locations = []
  alldeliveryPlans.forEach(({ location }) => {
    if (location.type) locations.push(location)
  })
  return locations
}

const { reducer, actions } = deliveryPlansSlice
export const { clear, add, update, selectOne, selectMulti, error } = actions

export default reducer
