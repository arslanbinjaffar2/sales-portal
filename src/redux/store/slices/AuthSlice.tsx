import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store/store'

// Define a type for the slice state
interface AuthState {
  user: any,
}

let authInfo =
    typeof window !== "undefined" && localStorage.getItem("agent");
const initialUser =
    authInfo && authInfo !== undefined ? JSON.parse(authInfo) : null;



// Define the initial state using that type
const initialState: AuthState = {
  user: initialUser,
}

export const authUserSlice = createSlice({
  name: 'authUser',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<any>) => {
      localStorage.setItem('agent', JSON.stringify(action.payload));
      state.user = action.payload;
    },
  },
})


export const { setAuthUser } = authUserSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.authUser.user

export default authUserSlice.reducer