import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import runsApi from '../api/runsApi'
import runsFields from '../api/conversions/runsFields'

// * normalization
const runsAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: (a, b) => {},
})

// * thunk
export const fetchRuns = createAsyncThunk(
  'runs/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await runsApi()
      console.log('response: ', response)
      const runs = Object.values(response).map(runsFields)
      console.log('runs: ', runs)
      return { runs }
    } catch (error) {
      console.error('fetch catch error:', error)
      // xApi throws a POJO, which redux can serialize and I want to record in the error key
      // but failures in the above code will generate an Error type, which redux cannot serialize
      const message = error instanceof Error ? error.message : error
      return rejectWithValue(message)
    }
  }
)

// * reducers / actions
const initialState = runsAdapter.getInitialState({
  loading: 'idle',
  selectedId: null,
})

const runsSlice = createSlice({
  name: 'runs',
  initialState,
  reducers: {
    clear: () => initialState,
    add: runsAdapter.addOne,
    update: runsAdapter.updateOne,
    select: (state, { payload }) => {
      state.selectedId = payload
    },
    error: (state, { payload: error }) => ({ ...state, error }),
  },
  extraReducers: {
    [fetchRuns.pending]: (state, { meta: { requestId } }) => {
      if (state.loading === 'idle') {
        state.currentRequestId = requestId
        state.loading = 'pending'
        state.error = null
      }
    },

    [fetchRuns.fulfilled]: (
      state,
      { meta: { requestId }, payload: { runs } }
    ) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = null
        state.selectedId = runs[0]?.id
        runsAdapter.setAll(state, runs)
      }
    },

    [fetchRuns.rejected]: (state, { meta: { requestId }, payload }) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = payload
      }
    },
  },
})

// * selectors (partly memoized)
const runsSelectors = runsAdapter.getSelectors()

// combine all aspects of entities:
// - createEntityAdapter's memoized sorted entities
// - keyed entities
// - createAsyncThunk's loading/error states as well as my own 'loaded' state
export const selectEntities = ({ runs }) => {
  const sortedEntities = runsSelectors.selectAll(runs)
  const keyedEntities = runs.entities
  const ids = runsSelectors.selectIds(runs)
  const { loading, error, selectedId } = runs
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
    error,
    loaded,
  }
}

export const selectEntityById =
  id =>
  ({ runs }) =>
    runsSelectors.selectById(runs, id)

export const selectSelectedId = ({ runs: { selectedId } }) => selectedId

export const selectSelectedEntity = ({ runs }) => {
  const { selectedId } = runs
  if (!selectedId) return null

  const selectedEntity = selectEntityById(selectedId)({ runs })

  return { selectedEntity }
}

const { reducer, actions } = runsSlice
export const { clear, add, update, select, error } = actions

export default reducer
