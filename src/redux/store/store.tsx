import { configureStore } from "@reduxjs/toolkit";
import { applyMiddleware } from "redux";
import eventReducer from "@/redux/store/slices/agentEventsSlice";
import paginationReducer from "@/redux/store/slices/pagination";

export const store = configureStore({
    reducer: {
        agentEvents: eventReducer,
        pagination: paginationReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



