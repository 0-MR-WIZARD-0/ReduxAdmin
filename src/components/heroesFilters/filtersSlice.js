import {useHttp} from '../../hooks/http.hook';
import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

const filtersAdapter = createEntityAdapter()

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
});

export const fetchFilter = createAsyncThunk(
    'filters/fetchFilter',
    () => {
        const {request} = useHttp();
        return request("http://localhost:3001/filters")
    }
)

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        changedFilter: (state, action) => {
            state.activeFilter = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilter.pending,  state => {state.filtersLoadingStatus = 'loading'})
            .addCase(fetchFilter.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle'
                filtersAdapter.setAll(state, action.payload)
            })
            .addCase(fetchFilter.rejected, state => {
                state.filtersLoadingStatus = 'error'
            })
            .addCase(()=>{})
    }
});

const {actions, reducer} = filtersSlice

export default reducer

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters)

export const {
    filterFetching,
    filterFetched,
    filterFetchingError,
    changedFilter
} = actions