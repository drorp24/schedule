import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  current,
} from '@reduxjs/toolkit'

import deliveryPlansApi from '../api/deliveryPlansApi'
import deliveryPlansFields from '../api/conversions/deliveryPlansFields'

// * normalization
const deliveryPlansAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: (a, b) => {},
})

// * thunk
export const fetchDeliveryPlans = createAsyncThunk(
  'deliveryPlans/fetch',
  async ({ runId }, { rejectWithValue }) => {
    try {
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
    deliveryPlans,
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
  ({ deliveryPlans: { meta, ids, loading, error } }) =>
    meta?.runId === runId && ids.length > 0 && loading === 'idle' && !error

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
