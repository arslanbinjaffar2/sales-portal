import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
    value: []
}


export const eventsSlice = createSlice({
    name: 'agentEvents',
    initialState,
    reducers: {
        // update agent events
        setAgentEvents: (state, action: PayloadAction<any>) => {
            state.value = action.payload;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action: PayloadAction<any>) => {
            return {
                ...state,
                ...action.payload.auth,
            };
        },
    },
})


// Action creators are generated for each case reducer function
export const { setAgentEvents } = eventsSlice.actions
export const selectAgentEvents = (state:any) => state.agentEvents.value;
export default eventsSlice.reducer