import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'

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
  selectedId: null,
})

const directivesSlice = createSlice({
  name: 'directives',
  initialState,
  reducers: {
    clear: () => initialState,
    add: directivesAdapter.addOne,
    update: directivesAdapter.updateOne,
    select: (state, { payload }) => {
      state.selectedId = payload
    },
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

// * selectors (partly memoized)
const directivesSelectors = directivesAdapter.getSelectors()

// combine all aspects of entities:
// - createEntityAdapter's memoized sorted entities
// - keyed entities
// - createAsyncThunk's loading/error states as well as my own 'loaded' state
export const selectEntities = ({ directives }) => {
  const sortedEntities = directivesSelectors.selectAll(directives)
  const keyedEntities = directives.entities
  const ids = directivesSelectors.selectIds(directives)
  const { loading, error, selectedId } = directives
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

export const selectEntityById = id => ({ directives }) =>
  directivesSelectors.selectById(directives, id)

export const selectSelectedId = ({ directives: { selectedId } }) => selectedId

export const selectSelectedEntity = ({ directives }) => {
  const { selectedId } = directives
  if (!selectedId) return null

  const selectedEntity = selectEntityById(selectedId)({ directives })

  return { selectedEntity }
}

const { reducer, actions } = directivesSlice
export const { clear, add, update, select, error } = actions

export default reducer
