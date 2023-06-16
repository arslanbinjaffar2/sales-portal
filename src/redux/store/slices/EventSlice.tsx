import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store/store'
import axios from 'axios'
import { AGENT_EVENTS_ENDPOINT } from '@/constants/endpoints'
import { authHeader } from '@/helpers'


// Slice Thunks
export const userEventOrders = createAsyncThunk(
  'users/EventOrder',
  async (data:any , { signal }) => {
    const source = axios.CancelToken.source()
    signal.addEventListener('abort', () => {
      source.cancel()
    })
    const response = await axios.post(`${AGENT_EVENTS_ENDPOINT}/${data.event_id}/orders`,data, {
      cancelToken: source.token,
      headers: authHeader('GET'),
    })
    return response.data
  }
)

// Define a type for the slice state
interface EventState {
  event:any,
  loading:boolean,
  error:any,
}


// Define the initial state using that type
const initialState: EventState = {
  event: null,
  loading:false,
  error:null,
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
  extraReducers: (builder) => {
    // Login thuckCases
    builder.addCase(userEventOrders.pending, (state, action) => {
      state.loading = true;
      state.event = null;
    }),
    builder.addCase(userEventOrders.fulfilled, (state, action) => {
      let res = action.payload;
      if(res.success){
        state.event = action.payload.data;
      }else{
          state.error = res.message;
      }
      state.loading = false;
    }),
    builder.addCase(userEventOrders.rejected, (state, action) => {
      console.log("rejected", action.payload);
      state.loading = false;
    })
  },
})


export const { setEvent, setLoading } = eventSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectEvent = (state: RootState) => state.event

export default eventSlice.reducer