import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store/store'
import axios from 'axios'
import { AGENT_EVENTS_ENDPOINT } from '@/constants/endpoints'
import { authHeader, handleErrorResponse } from '@/helpers'


// Slice Thunks
export const userEvent = createAsyncThunk(
  'users/Event',
  async (data:any , { signal, dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source()
    signal.addEventListener('abort', () => {
      source.cancel()
    })
    try {
      const response = await axios.post(`${AGENT_EVENTS_ENDPOINT}/${data.event_id}/data`,data, {
        cancelToken: source.token,
        headers: authHeader('GET'),
      })
      return response.data
      
    } catch (err:any) {
      if (!err.response) {
        throw err
      }
      if(err.response.status !== 200){
        handleErrorResponse(err.response.status, dispatch);
      }
        // Return the known error for future handling
      return rejectWithValue(err.response.status);
    }
  }
)

export const userEventOrders = createAsyncThunk(
  'users/EventOrders',
  async (data:any , { signal, dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source()
    signal.addEventListener('abort', () => {
      source.cancel()
    })
    try {
      const response = await axios.post(`${AGENT_EVENTS_ENDPOINT}/${data.event_id}/orders`,data, {
        cancelToken: source.token,
        headers: authHeader('GET'),
      })
      return response.data
      
    } catch (err:any) {
      if (!err.response) {
        throw err
      }
      if(err.response.status !== 200){
        handleErrorResponse(err.response.status, dispatch);
      }
        // Return the known error for future handling
      return rejectWithValue(err.response.status);
    }
  }
)

// Define a type for the slice state
interface EventState {
  event:any,
  event_orders:any
  loading:boolean,
  fetching_orders:boolean,
  error:any,
  totalPages:number,
  currentPage:number,
}


// Define the initial state using that type
const initialState: EventState = {
  event: null,
  event_orders: null,
  loading:true,
  fetching_orders:true,
  error:null,
  totalPages:0,
  currentPage:1,
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
    builder.addCase(userEvent.pending, (state, action) => {
      state.loading = true;
      state.event = null;
    }),
    builder.addCase(userEvent.fulfilled, (state, action) => {
      let res = action.payload;
      if(res.success){
        state.event = action.payload.data;
      }else{
          state.error = res.message;
      }
      state.loading = false;
    }),
    builder.addCase(userEvent.rejected, (state, action) => {
      console.log("rejected", action.payload);
      state.loading = false;
    }),
    // Login thuckCases
    builder.addCase(userEventOrders.pending, (state, action) => {
      state.fetching_orders = true;
      state.event_orders = null;
    }),
    builder.addCase(userEventOrders.fulfilled, (state, action) => {
      let res = action.payload;
      if(res.success){
        state.event_orders = action.payload.data;
        state.totalPages = action.payload.data.last_page;
        state.currentPage = action.payload.data.current_page;
      }else{
          state.error = res.message;
      }
      state.fetching_orders = false;
    }),
    builder.addCase(userEventOrders.rejected, (state, action) => {
      console.log("rejected", action.payload);
      state.fetching_orders = false;
    })
  },
})


export const { setEvent, setLoading } = eventSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectEvent = (state: RootState) => state.event

export default eventSlice.reducer