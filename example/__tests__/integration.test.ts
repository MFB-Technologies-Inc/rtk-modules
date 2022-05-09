// Copyright 2022 MFB Technologies, Inc.

import { ordersSelectors } from "../orders/selectors"
import { ordersSlice, Product } from "../orders/slice"
import { ordersThunks } from "../orders/thunks"
import { RootState, store } from "../store"

/*
 * Redux Store Integration Tests
 *
 * This is one way to test a redux store, including its actions, thunks,
 * and selectors.  Note that there's no need to involve React in order to fully
 * test the redux logic.  But you can mock out versions of useSelector and
 * useDispatch to (somewhat) mimic the feel of how you would use things in React,
 * as is done in these tests.
 */

const useSelector: <R>(selector: (state: RootState) => R) => R = selector =>
  selector(store.getState())
const useDispatch = () => store.dispatch

it("examine initial state", () => {
  const orders = useSelector(ordersSelectors.getAllOrders)
  expect(orders.length).toBe(0)
})

it("get some orders from the server", async () => {
  const dispatch = useDispatch()
  await dispatch(ordersThunks.getOrder())
  await dispatch(ordersThunks.getOrder())
  const orders = useSelector(ordersSelectors.getAllOrders)
  expect(orders.length).toBe(2)
})

it("see if any of them are crts (spoiler: they aren't)", () => {
  const crts = useSelector(ordersSelectors.getOrdersByType(Product.crt))
  expect(crts.length).toBe(0)
})

it("see if any of them are floppies (yes!)", () => {
  const crts = useSelector(ordersSelectors.getOrdersByType(Product.floppy))
  expect(crts.length).toBe(2)
})

it("remove crts from available products, and add dot matrix printers(!)", () => {
  const dispatch = useDispatch()
  dispatch(ordersSlice.actions.productRemoved(Product.crt))
  dispatch(ordersSlice.actions.productAdded(Product.dotMatrix))
  expect(store.getState().orders.availableProducts).toContain(Product.dotMatrix)
  expect(store.getState().orders.availableProducts).not.toContain(Product.crt)
})

it("ship a product", async () => {
  const dispatch = useDispatch()
  const order = useSelector(ordersSelectors.getOldestOrder)
  await dispatch(ordersThunks.shipOrder(order))
  const orders = useSelector(ordersSelectors.getAllOrders)
  expect(orders.length).toBe(1)
})
