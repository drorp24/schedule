import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  // current,
} from '@reduxjs/toolkit'
// import { createSelector } from 'reselect'

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
  selected: null,
})

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    clear: () => initialState,
    add: resourcesAdapter.addOne,
    update: resourcesAdapter.updateOne,
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

// * memoized selectors (reselect)
// common selector functions should be defined here rather than in the callers for memoization
const resourcesSelectors = resourcesAdapter.getSelectors()

// combine createAsyncThunk's loading/error states with createEntityAdapter's ids/entities join
// 'entities' in this selector are returned as a sorted array rather than keyed
export const selectResources = ({ resources }) => {
  const entities = resourcesSelectors.selectAll(resources)
  const { loading, error, selected } = resources
  const loaded = entities.length > 0 && loading === 'idle' && !error
  return { entities, selected, loading, error, loaded }
}

// this will return entities keyed, as they naturally appear in redux
// todo: memoize with reselect
export const selectEntities = ({ resources: { entities } }) => ({
  entities,
})

export const selectEntityById = id => ({ resources }) =>
  resourcesSelectors.selectById(resources, id)

export const selectIds = ({ resources }) =>
  resourcesSelectors.selectIds(resources)

export const selectSelectedId = ({ resources: { selected } }) => selected

export const selectSelectedEntity = ({ resources }) => {
  const { selected } = resources
  if (!selected) return null

  const selectedE = selectEntityById(selected)({ resources })

  return { selectedE }
}

const { reducer, actions } = resourcesSlice
export const { clear, add, update, error } = actions

export default reducer
