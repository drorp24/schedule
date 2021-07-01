import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  current,
} from '@reduxjs/toolkit'

import depotsApi from '../api/depotsApi'
import depotsFields from '../api/conversions/depotsFields'
import { criteriaDefaults, initialCriteria } from '../redux/config'

// * normalization
const depotsAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: (a, b) => {},
})

// * thunk
export const fetchDepots = createAsyncThunk(
  'depots/fetch',
  async ({ runId }, { rejectWithValue }) => {
    try {
      const response = await depotsApi(runId)
      const depots = Object.values(response).map(depotsFields)
      return { runId, depots }
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
  meta: null,
  loading: 'idle',
  issues: [],
  selectedIds: [],
  criteria: initialCriteria,
})

const depotsSlice = createSlice({
  name: 'depots',
  initialState,
  reducers: {
    clear: () => initialState,
    add: depotsAdapter.addOne,
    update: depotsAdapter.updateOne,
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
    setCriteria: (state, { payload }) => {
      payload.forEach(({ prop, value }) => {
        state.criteria[prop] = value
        if (value && !criteriaDefaults[prop].map && !state.criteria.map.user)
          state.criteria.map.value = false
      })
    },
    toggleFilter: state => {
      state.criteria.filter = !state.criteria.filter
    },
    toggleShowOnMap: state => {
      state.criteria.map.value = !state.criteria.map.values
      state.criteria.map.user = true
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

    [fetchDepots.rejected]: (
      state,
      { meta: { requestId }, payload, error }
    ) => {
      console.error('fetchDepots Rejected:')
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
const depotsSelectors = depotsAdapter.getSelectors()

// combine together:
// - createEntityAdapter's memoized sorted entities
// - keyed entities
// - createAsyncThunk's loading/error states as well as my own 'loaded' state
export const selectEntities = ({ depots }) => {
  const sortedEntities = depotsSelectors.selectAll(depots)
  const keyedEntities = depots.entities
  const ids = depotsSelectors.selectIds(depots)
  const { loading, error, selectedIds } = depots
  const selectedEntities = selectedIds.map(id => keyedEntities[id])
  const isLoading = loading === 'pending'
  const loaded = sortedEntities.length > 0 && loading === 'idle' && !error
  return {
    depots,
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

export const selectLoaded = ({ depots: { ids, loading, error } }) =>
  ids.length > 0 && loading === 'idle' && !error

export const selectCriteria = ({ depots }) => depots.criteria

export const selectCriteriaEntities = ({ depots }) => ({})

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

export const selectSelectedEntities = ({ depots }) => {
  if (!depots.ids?.length || !depots.selectedIds?.length)
    return { selectedEntities: [], locations: [] }

  const { selectedIds } = depots
  const locations = selectedIds.map(depotId => {
    const {
      geolocation: { geometry },
      drone_type,
    } = depots.entities[depotId]
    const properties = { depotId, drone_type }
    return { geometry, properties }
  })

  const selectedEntities = selectedIds.map(id => depots.entities[id])
  return { selectedEntities, locations }
}

export const selectDeliveriesById =
  id =>
  ({ deliveries }) =>
    id &&
    deliveries.employedDepots[id]?.deliveries?.length &&
    deliveries.employedDepots[id].deliveries.map(({ id }) => id)

const { reducer, actions } = depotsSlice
export const {
  clear,
  add,
  update,
  selectOne,
  selectMulti,
  setCriteria,
  toggleFilter,
  toggleShowOnMap,
  error,
} = actions

export default reducer
