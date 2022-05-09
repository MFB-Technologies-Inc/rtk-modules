import { configureStore } from "@reduxjs/toolkit"
import "redux-thunk"
import { counterSlice } from "./counterSlice"
import { ordersSlice } from "./orders/slice"

export const store = configureStore({
  reducer: {
    [ordersSlice.name]: ordersSlice.reducer,
    [counterSlice.name]: counterSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
