import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store/store'

// Define a type for the slice state
interface EventState {
  event:any,
  loading:boolean,
}


// Define the initial state using that type
const initialState: EventState = {
  event: null,
  loading:false,
}

export const eventSlice = createSlice({
  name: 'event',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setEvent: (state, action: PayloadAction<any>) => {
      state.event = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
})


export const { setEvent, setLoading } = eventSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectEvent = (state: RootState) => state.event

export default eventSlice.reducer