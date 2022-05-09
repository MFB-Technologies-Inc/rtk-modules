// Copyright 2022 MFB Technologies, Inc.

import { produceMockState, produceStateSetter } from "../../../src"
import { compose, first, last, prop } from "../../../src/utils"
import {
  orderPlainSelectors,
  orderSelectorCreators
} from "../../orders/selectors"
import {
  initialOrdersState,
  Order,
  OrdersState,
  Product
} from "../../orders/slice"

/* Selector Unit Tests
 *
 *  Unit testing selectors is typically not that interesting or
 *  difficult, but if you need to, having them modularized following
 *  the approach in this package you can test them against your
 *  _slice_ state (rather than root state).
 *
 */

const createMockState = produceMockState(initialOrdersState)
const set = produceStateSetter<OrdersState>()

const mockState = createMockState([
  set("orderQueue", [
    {
      id: "2323",
      productType: Product.crt,
      customerId: 32,
      datePlaced: "2022-04-13"
    },
    {
      id: "8d93hkl2",
      productType: Product.crt,
      customerId: 32,
      datePlaced: "2022-04-13"
    },
    {
      id: "jalk3d",
      productType: Product.dotMatrix,
      customerId: 33,
      datePlaced: "2022-04-13"
    }
  ])
])

it(`${orderPlainSelectors.getAllOrders.name}`, () => {
  expect(orderPlainSelectors.getAllOrders(mockState)).toEqual(
    mockState.orderQueue
  )
})

it(`${orderPlainSelectors.getOldestOrder.name}`, () => {
  const testingState = produceMockState(mockState)([
    set(
      "orderQueue",
      compose(last<Order>(), prop<Order>()("datePlaced"))("2022-05-09")
    )
  ])
  expect(orderPlainSelectors.getOldestOrder(testingState)).toEqual(
    testingState.orderQueue.pop()
  )
})

it(`${orderSelectorCreators.getOrdersByType.name}`, () => {
  const testingState = produceMockState(mockState)([
    set(
      "orderQueue",
      compose(first<Order>(), prop<Order>()("productType"))(Product.scsi)
    )
  ])
  expect(orderSelectorCreators.getOrdersByType(Product.scsi).length).toEqual(1)
})
