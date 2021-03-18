import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  // current,
} from '@reduxjs/toolkit'
// import { createSelector } from 'reselect'

import directivesApi from '../api/directivesApi'

// * normalization
const directivesAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: (a, b) => {},
})

// * thunk
export const fetchDirectives = createAsyncThunk(
  'directives/fetch',
  async ({ directivesFields }, thunkAPI) => {
    try {
      const response = await directivesApi(
        'e0e80704-e4d7-45bd-b28f-d51186c9cef6'
      )
      const directives = response.map(directivesFields)
      return { directives }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.toString())
    }
  }
)

// * reducers / actions
const initialState = directivesAdapter.getInitialState({
  loading: 'idle',
  selected: null,
})

const directivesSlice = createSlice({
  name: 'directives',
  initialState,
  reducers: {
    clear: () => initialState,
    add: directivesAdapter.addOne,
    update: directivesAdapter.updateOne,
    error: (state, { payload: error }) => ({ ...state, error }),
  },
  extraReducers: {
    [fetchDirectives.pending]: (state, { meta: { requestId } }) => {
      if (state.loading === 'idle') {
        state.currentRequestId = requestId
        state.loading = 'pending'
        state.error = null
      }
    },

    [fetchDirectives.fulfilled]: (
      state,
      { meta: { requestId }, payload: { directives } }
    ) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = null
        directivesAdapter.setAll(state, directives)
      }
    },

    [fetchDirectives.rejected]: (state, { meta: { requestId }, payload }) => {
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
const directivesSelectors = directivesAdapter.getSelectors()

// combine createAsyncThunk's loading/error states with createEntityAdapter's ids/entities join
// 'entities' in this selector are returned as a sorted array rather than keyed
export const selectDirectives = ({ directives }) => {
  const entities = directivesSelectors.selectAll(directives)
  const { loading, error, selected } = directives
  const loaded = entities.length > 0 && loading === 'idle' && !error
  return { entities, selected, loading, error, loaded }
}

// this will return entities keyed, as they naturally appear in redux
// todo: memoize with reselect
export const selectEntities = ({ directives: { entities } }) => ({
  entities,
})

export const selectEntityById = id => ({ directives }) =>
  directivesSelectors.selectById(directives, id)

export const selectIds = ({ directives }) =>
  directivesSelectors.selectIds(directives)

export const selectSelectedId = ({ directives: { selected } }) => selected

export const selectSelectedEntity = ({ directives }) => {
  const { selected } = directives
  if (!selected) return null

  const selectedE = selectEntityById(selected)({ directives })

  return { selectedE }
}

const { reducer, actions } = directivesSlice
export const { clear, add, update, error } = actions

export default reducer
