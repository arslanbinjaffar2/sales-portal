import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {RootState} from "@/redux/store/store";

type agentEventState = {
    value: Array<any>;
};


const initialState = {
    value: []
} as agentEventState;


export const eventsSlice = createSlice({
    name: 'agentEvents',
    initialState,
    reducers: {
        reset: () => initialState,
        // update agent events
        setAgentEvents: (state, action: PayloadAction<any>) => {
            state.value = action.payload;
        },
        getAgentEvents: (state) => {
            state.value;
        },
    },
})


// Action creators are generated for each case reducer function
export const { setAgentEvents, getAgentEvents } = eventsSlice.actions
export const selectAgentEvents = (state: RootState) => state.agentEvents.value ;
export default eventsSlice.reducer