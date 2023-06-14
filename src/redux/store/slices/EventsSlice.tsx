import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store/store'

// Define a type for the slice state
interface EventsState {
  event:any[],
  loading:boolean,
}


// Define the initial state using that type
const initialState: EventsState = {
  event: [],
  loading:false,
}

export const eventsSlice = createSlice({
  name: 'events',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<any>) => {
      state.event = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
})


export const { setEvents, setLoading } = eventsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectEvent = (state: RootState) => state.events

export default eventsSlice.reducer