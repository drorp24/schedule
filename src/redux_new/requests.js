import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  current,
} from '@reduxjs/toolkit'

import requestsApi from '../api_new/requestsApi'
import requestsFields from '../api_new/conversions/requestsFields'

// * normalization
const requestsAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: (a, b) => a.priority - b.priority,
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
  async ({ runId }, { rejectWithValue }) => {
    try {
      const response = await requestsApi(runId)
      const requests = Object.values(response).map(requestsFields)
      const planIds = {}
      requests.forEach(({ id, package_delivery_plan_ids }) => {
        planIds[package_delivery_plan_ids[0]] = id
      })
      return { runId, requests, planIds }
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
  meta: null,
  loading: 'idle',
  issues: [],
  selectedIds: [],
})

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    clear: () => initialState,
    add: requestsAdapter.addOne,
    update: requestsAdapter.updateOne,
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
    [fetchRequests.pending]: (state, { meta: { requestId } }) => {
      if (state.loading === 'idle') {
        state.currentRequestId = requestId
        state.loading = 'pending'
        state.error = null
      }
    },

    [fetchRequests.fulfilled]: (
      state,
      { meta: { requestId }, payload: { runId, requests, planIds, issues } }
    ) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = null
        if (issues) state.issues = issues
        state.meta = { runId }
        requestsAdapter.setAll(state, requests)
        state.planIds = planIds
      }
    },

    [fetchRequests.rejected]: (
      state,
      { meta: { requestId }, payload, error }
    ) => {
      console.error('fetchRequests Rejected:')
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
const requestsSelectors = requestsAdapter.getSelectors()

// combine together:
// - createEntityAdapter's memoized sorted entities
// - keyed entities
// - createAsyncThunk's loading/error states as well as my own 'loaded' state
export const selectEntities = ({ requests }) => {
  const sortedEntities = requestsSelectors.selectAll(requests)
  const keyedEntities = requests.entities
  const ids = requestsSelectors.selectIds(requests)
  const { loading, error, selectedIds } = requests
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

export const selectIds = ({ requests }) => requestsSelectors.selectIds(requests)

export const selectEntityById =
  id =>
  ({ requests }) =>
    requestsSelectors.selectById(requests, id)

export const selectSelectedEntities = ({ requests, deliveryPlans }) => {
  if (
    !requests.ids?.length ||
    !deliveryPlans.ids?.length ||
    !requests.selectedIds?.length
  )
    return {}

  const { selectedIds } = requests
  const locations = []
  selectedIds
    .map(requestId => ({
      requestId,
      deliveryPlanIds: requests.entities[requestId].package_delivery_plan_ids,
    }))
    .forEach(({ requestId, deliveryPlanIds = [] }) => {
      deliveryPlanIds.forEach(deliveryPlanId => {
        const deliveryPlan = deliveryPlans.entities[deliveryPlanId]
        const { geolocation } = deliveryPlan
        locations.push({ requestId, deliveryPlanId, geolocation })
      })
    })
  const selectedEntities = selectedIds.map(id => requests.entities[id])
  return { selectedEntities, locations }
}

// ToDo: remove
export const selectSelectedId = ({ requests: { selectedId } }) => selectedId

export const selectSelectedEntity = ({ requests }) => {
  const { selectedId } = requests
  if (!selectedId) return null

  const selectedEntity = selectEntityById(selectedId)({ requests })

  return { selectedEntity }
}

const { reducer, actions } = requestsSlice
export const { clear, add, update, selectOne, selectMulti, error } = actions

export default reducer