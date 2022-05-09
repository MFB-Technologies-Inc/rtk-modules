// Copyright 2022 MFB Technologies, Inc.

import { createAsyncThunk } from "@reduxjs/toolkit"
import { produceThunkReducerInjector } from "../../src"
import { api, Status } from "./api"
import { Order, OrdersState } from "./slice"

/* Modularized Thunks
 *
 * You probably already modularize your thunks in a fashion similar to
 * how it is done here.  This file demonstrates how you can also
 * modularize your thunk _reducers_ so that you can keep them together
 * with their corresponding thunks, and prevent your slice file from
 * becoming too unwieldy.
 */

/*
 * Start off by feeding `produceThunkReducerInjector` your slice state as a
 * type parameter.  This just avoids messy, duplicative type
 * parameters later on.
 */
const ordersThunkReducerInjector = produceThunkReducerInjector<OrdersState>()

/*
 * Define your thunks as usual
 */

export const ordersThunks = {
  getOrder: createAsyncThunk<Order, void, { rejectValue: string }>(
    "orders/getOrder",
    async (_, thunkApi) => {
      try {
        return await api.getOrder()
      } catch (error) {
        return thunkApi.rejectWithValue("Getting order failed")
      }
    }
  ),
  shipOrder: createAsyncThunk<Status, Order, { rejectValue: string }>(
    "orders/shipOrder",
    async (order, thunkApi) => {
      const status = await api.ship(order)
      if (status === Status.failure) {
        return thunkApi.rejectWithValue("Shipment failed...")
      }
      return status
    }
  )
}

/*
 * Build your thunk reducers just like you would inside the `extraReducers`
 * property of the `createSlice` parameter using the builder pattern.  As
 * is the case there, state and action are automatically typed correctly.
 *
 * Import this injector function into your slice module and call it inside
 * extraReducers with the builder callback argument, e.g.:
 *    extraReducers:  builder => injectOrderThunkReducers(builder)
 */
export const injectOrderThunkReducers = ordersThunkReducerInjector(builder => {
  builder.addCase(ordersThunks.getOrder.fulfilled, (state, action) => {
    if (state.availableProducts.includes(action.payload.productType)) {
      state.orderQueue.unshift(action.payload)
    } else {
      state.failedOrders++
    }
  })
  builder.addCase(ordersThunks.getOrder.rejected, (state, action) => {
    if (action.payload) {
      state.unexpectedErrors.push(action.payload)
    }
  })
  builder.addCase(ordersThunks.shipOrder.fulfilled, (state, action) => {
    if (action.payload === Status.success) {
      const shippedIndex = state.orderQueue.findIndex(
        x => x.id === action.meta.arg.id
      )
      if (shippedIndex >= 0) {
        state.orderQueue.splice(shippedIndex, 1)
      }
    }
  })
})
