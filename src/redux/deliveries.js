import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  current,
} from '@reduxjs/toolkit'

import deliveriesApi from '../api/deliveriesApi'
import deliveriesFields from '../api/conversions/deliveriesFields'
import {
  updateEffects,
  removeEffects,
  updateSelectedDeliveries,
} from './updateEffects'

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
      window.buildTimeline = buildTimeline
      window.deliveries = deliveries
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
  selectedRequests: {},
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
    updateSelection: (state, { payload: { selection, requests } }) => {
      state.selectedIds = selection
      updateSelectedDeliveries({ state, selection, requests })
    },
    updateDeliveryEffects: updateEffects,
    removeDeliveryEffects: removeEffects,
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
    deliveries,
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

export const selectLoaded =
  runId =>
  ({ deliveries: { meta, ids, loading, error } }) =>
    meta?.runId === runId && ids.length > 0 && loading === 'idle' && !error

export const selectEffectsRecorded =
  runId =>
  ({ deliveries: { meta, fulfilledRequests } }) =>
    meta?.runId === runId &&
    fulfilledRequests &&
    !!Object.keys(fulfilledRequests)?.length

export const selectIds = ({ deliveries }) =>
  deliveriesSelectors.selectIds(deliveries)

export const selectEntityById =
  id =>
  ({ deliveries }) =>
    deliveriesSelectors.selectById(deliveries, id)

export const selectSelectedEntities = ({ deliveries }) => {
  if (!deliveries.ids?.length || !deliveries.selectedIds?.length)
    return { selectedEntities: [], locations: [] }

  const selectedEntities = []
  const locations = []
  const { selectedIds } = deliveries

  selectedIds.forEach(idAndLeg => {
    const [deliveryId, legIndex] = idAndLeg.split(':')
    const delivery = deliveries.entities[deliveryId]
    selectedEntities.push(delivery)
    const deliveryLeg = delivery.drone_deliveries[legIndex]
    deliveryLeg.fulfilledRequests.forEach(({ location }) => {
      locations.push(location)
    })
  })

  return { selectedEntities, locations }
}

const { reducer, actions } = deliveriesSlice
export const {
  clear,
  add,
  update,
  selectOne,
  selectMulti,
  updateSelection,
  updateDeliveryEffects,
  removeDeliveryEffects,
  error,
} = actions

export default reducer
