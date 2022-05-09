// Copyright 2022 MFB Technologies, Inc.

import { produceRootSelectors } from "../../src"
import { RootState } from "../store"
import { ordersSlice, OrdersState, Product } from "./slice"

/* Modularized Selectors
 *
 * You probably already modularize your selectors selector creators (i.e.,
 * functions that take an argument and return a selector that has closed
 * over the value of that argument).  However, when doing that you need
 * to keep in mind that you are writing selectors against _root_ state,
 * not just the state of your local slice.  That's not that big a deal, and
 * may even be desirable if, for example, you want to select across multiple
 * slices.  But, if you are developing your app with highly modularized
 * feature domains you may not want to have developers doing that and you
 * may want to make it easier for those writing selectors to think only
 * in terms of their domain.
 *
 * The `produceRootSelector` utility requires you to divide your selectors
 * and selector creators into separate groups.  This is because, just based
 * on their values, javascript can't tell the difference between a function
 * and a curried function--they are both just "function".
 */

/* Write plain selectors like you would before but against your _slice_
 * state.
 **/
export const orderPlainSelectors = {
  getAllOrders: (state: OrdersState) => state.orderQueue,
  getOldestOrder: (state: OrdersState) => state.orderQueue.slice(-1)[0]
}

/* Write selector creators like you would before but against your _slice_
 * state.  NB: Currently this only supports single argument creators, though
 * you can of course pass in an object with multiple properties.
 **/
export const orderSelectorCreators = {
  getOrdersByType: (productType: Product) => (state: OrdersState) =>
    state.orderQueue.filter(product => product.productType === productType)
}

/*
 * Compose them by calling `produceRootSelectors` in the curried function style,
 * where the first call provides a single type parameter argument with RootState
 * and the second provides a single real argument with the name of your slice.
 * The third call is where you provide the selector groups you created above.
 *
 * This style of calling may be uncomfortable, and if so, you could break it
 * up by doing each call separately and creating an intermediate function.
 *
 * Export the resulting object and all your selectors, which can now be used
 * against root state (i.e. they can be passed to `useSelector`).
 */
export const ordersSelectors = produceRootSelectors<RootState>()(
  ordersSlice.name
)(orderPlainSelectors, orderSelectorCreators)
