import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import resourcesApi from '../api/resourcesApi'

// * normalization
const resourcesAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: (a, b) => {},
})

// * thunk
export const fetchResources = createAsyncThunk(
  'resources/fetch',
  async ({ resourcesFields }, thunkAPI) => {
    try {
      const response = await resourcesApi(
        'e0e80704-e4d7-45bd-b28f-d51186c9cef6'
      )
      const resources = response.map(resourcesFields)
      return { resources }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.toString())
    }
  }
)

// * reducers / actions
const initialState = resourcesAdapter.getInitialState({
  loading: 'idle',
  selectedId: null,
})

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    clear: () => initialState,
    add: resourcesAdapter.addOne,
    update: resourcesAdapter.updateOne,
    select: (state, { payload }) => {
      state.selectedId = payload
    },
    error: (state, { payload: error }) => ({ ...state, error }),
  },
  extraReducers: {
    [fetchResources.pending]: (state, { meta: { requestId } }) => {
      if (state.loading === 'idle') {
        state.currentRequestId = requestId
        state.loading = 'pending'
        state.error = null
      }
    },

    [fetchResources.fulfilled]: (
      state,
      { meta: { requestId }, payload: { resources } }
    ) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = null
        resourcesAdapter.setAll(state, resources)
      }
    },

    [fetchResources.rejected]: (state, { meta: { requestId }, payload }) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = payload
      }
    },
  },
})

// * selectors (partly memoized)
const resourcesSelectors = resourcesAdapter.getSelectors()

// combine all aspects of entities:
// - createEntityAdapter's memoized sorted entities
// - keyed entities
// - createAsyncThunk's loading/error states as well as my own 'loaded' state
export const selectEntities = ({ resources }) => {
  const sortedEntities = resourcesSelectors.selectAll(resources)
  const keyedEntities = resources.entities
  const ids = resourcesSelectors.selectIds(resources)
  const { loading, error, selectedId } = resources
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

export const selectEntityById = id => ({ resources }) =>
  resourcesSelectors.selectById(resources, id)

export const selectSelectedId = ({ resources: { selectedId } }) => selectedId

export const selectSelectedEntity = ({ resources }) => {
  const { selectedId } = resources
  if (!selectedId) return null

  const selectedEntity = selectEntityById(selectedId)({ resources })

  return { selectedEntity }
}

const { reducer, actions } = resourcesSlice
export const { clear, add, update, select, error } = actions

export default reducer
