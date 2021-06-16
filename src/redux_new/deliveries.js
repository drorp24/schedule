import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  current,
} from '@reduxjs/toolkit'

import deliveriesApi from '../api_new/deliveriesApi'
import deliveriesFields from '../api_new/conversions/deliveriesFields'

// * normalization
const deliveriesAdapter = createEntityAdapter({
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
export const fetchDeliveries = createAsyncThunk(
  'deliveries/fetch',
  async ({ runId, buildTimeline }, { rejectWithValue }) => {
    try {
      const response = await deliveriesApi(runId)
      const deliveries = Object.values(response).map(deliveriesFields)
      buildTimeline({ deliveries })
      return { runId, deliveries }
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
    // by comparing the deliveries' runId param with the recorded runId of last succesful fetch.
    //
    // Redundant fetching would otherwise happen if component is re-rendered
    // for reasons such as locale change that trigger an overall rerender.
    condition: ({ runId }, { getState }) => {
      const {
        deliveries: { meta },
      } = getState()
      if (meta?.runId === runId) return false
    },
  }
)

// * reducers / actions
const initialState = deliveriesAdapter.getInitialState({
  meta: null,
  loading: 'idle',
  issues: [],
  selectedIds: [],
})

const deliveriesSlice = createSlice({
  name: 'deliveries',
  initialState,
  reducers: {
    clear: () => initialState,
    add: deliveriesAdapter.addOne,
    update: deliveriesAdapter.updateOne,
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
    [fetchDeliveries.pending]: (state, { meta: { deliveryId } }) => {
      if (state.loading === 'idle') {
        state.currentDeliveryId = deliveryId
        state.loading = 'pending'
        state.error = null
      }
    },

    [fetchDeliveries.fulfilled]: (
      state,
      { meta: { deliveryId }, payload: { runId, deliveries, issues } }
    ) => {
      if (
        state.loading === 'pending' &&
        state.currentDeliveryId === deliveryId
      ) {
        state.currentDeliveryId = undefined
        state.loading = 'idle'
        state.error = null
        if (issues) state.issues = issues
        state.meta = { runId }
        deliveriesAdapter.setAll(state, deliveries)
      }
    },

    [fetchDeliveries.rejected]: (
      state,
      { meta: { deliveryId }, payload, error }
    ) => {
      console.error('fetchDeliveries Rejected:')
      if (error?.message) console.error(error.message)
      if (
        state.loading === 'pending' &&
        state.currentDeliveryId === deliveryId
      ) {
        state.currentDeliveryId = undefined
        state.loading = 'idle'
        state.error = payload
      }
    },
  },
})

// * selectors (partly memoized)
const deliveriesSelectors = deliveriesAdapter.getSelectors()

// combine together:
// - createEntityAdapter's memoized sorted entities
// - keyed entities
// - createAsyncThunk's loading/error states as well as my own 'loaded' state
export const selectEntities = ({ deliveries }) => {
  const sortedEntities = deliveriesSelectors.selectAll(deliveries)
  const keyedEntities = deliveries.entities
  const ids = deliveriesSelectors.selectIds(deliveries)
  const { loading, error, selectedIds } = deliveries
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

export const selectIds = ({ deliveries }) =>
  deliveriesSelectors.selectIds(deliveries)

export const selectEntityById =
  id =>
  ({ deliveries }) =>
    deliveriesSelectors.selectById(deliveries, id)

export const selectSelectedEntities = ({ deliveries, deliveryPlans }) => {
  if (
    !deliveries.ids?.length ||
    !deliveryPlans.ids?.length ||
    !deliveries.selectedIds?.length
  )
    return {}

  const { selectedIds } = deliveries
  const locations = []
  selectedIds
    .map(deliveryId => ({
      deliveryId,
      deliveryPlanIds:
        deliveries.entities[deliveryId].package_delivery_plan_ids,
    }))
    .forEach(({ deliveryId, deliveryPlanIds = [] }) => {
      deliveryPlanIds.forEach(deliveryPlanId => {
        const deliveryPlan = deliveryPlans.entities[deliveryPlanId]
        const { geolocation } = deliveryPlan
        locations.push({ deliveryId, deliveryPlanId, geolocation })
      })
    })
  const selectedEntities = selectedIds.map(id => deliveries.entities[id])
  return { selectedEntities, locations }
}

// ToDo: remove
export const selectSelectedId = ({ deliveries: { selectedId } }) => selectedId

export const selectSelectedEntity = ({ deliveries }) => {
  const { selectedId } = deliveries
  if (!selectedId) return null

  const selectedEntity = selectEntityById(selectedId)({ deliveries })

  return { selectedEntity }
}

const { reducer, actions } = deliveriesSlice
export const { clear, add, update, selectOne, selectMulti, error } = actions

export default reducer
