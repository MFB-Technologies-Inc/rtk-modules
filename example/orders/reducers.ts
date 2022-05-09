// Copyright 2022 MFB Technologies, Inc.

import { produceCaseReducer } from "../../src"
import { initialOrdersState, OrdersState, Product } from "../orders/slice"

/* Modularized Case Reducers
 *
 * This file demonstrates modularizing case reducers.  This can be
 * nice if you have a lot of reducers or if you don't want your slice
 * module to get too large.  Some may also find it makes testing a
 * little easier or more organized.
 *
 */

/*
 * Start off by feeding `produceCaseReducer` your slice state as a
 * type parameter.  This just avoids messy, duplicative type
 * parameters later on.
 */

const createOrdersReducer = produceCaseReducer<OrdersState>()

/*
 * Create your case reducers just like you would inside of `createSlice`
 * but just wrap each one in the creator function you made above along with
 * a single type parameter that specifies the type of your action.payload.
 * With that, state and action will be typed correctly in each function.
 *
 * Export this file and import it into your slice module.  (See the note
 * below on possible circular dependency issues.)
 */
export const ordersReducers = {
  productAdded: createOrdersReducer<Product>((state, action) => {
    const addedProduct = action.payload
    if (!state.availableProducts.includes(addedProduct)) {
      state.availableProducts.push(addedProduct)
    }
  }),
  productRemoved: createOrdersReducer<Product>((state, action) => {
    const removedProduct = action.payload
    const removalIndex = state.availableProducts.indexOf(removedProduct)
    if (removalIndex >= 0) {
      state.availableProducts.splice(removalIndex, 1)

      state.orderQueue = state.orderQueue.filter(
        product => product.productType !== removedProduct
      )
    }
  }),
  resetSliceState: createOrdersReducer<undefined>(
    (_state, _action) => initialOrdersState
  )
}

/*
 * NB: There is a fairly subtle circular dependency issue introduced
 * by the fact that this module imports initialOrdersState.  If this module
 * is called (i.e., imported) before the slice module it can lead to problems,
 * for example, the call to createSlice not creating a fully populated object.
 *
 * The simplest way to avoid this issue in practice is not to have the circular
 * import in the first place.  E.g., here, you could just define
 * initialOrdersState in its own module which they both import.
 *
 * Otherwise, you just have to pay attention to the order of imports.  As an
 * illustration, try reversing the order for the slice and reducer imports
 * in the test module for these reducers.
 */
