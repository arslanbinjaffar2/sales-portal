import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {RootState} from "@/redux/store/store";

type paginationState = {
    value: {};
};


const initialState = {
    value: {}
} as paginationState;


export const paginationSlice = createSlice({
    name: 'pagination',
    initialState,
    reducers: {
        reset: () => initialState,
        // update agent events
        setPaginationData: (state, action: PayloadAction<any>) => {
            state.value = action.payload;
        },
    },
})


// Action creators are generated for each case reducer function
export const { setPaginationData } = paginationSlice.actions;
export const selectPagination = (state: RootState) => state.pagination.value;
export default paginationSlice.reducer