// Copyright 2022 MFB Technologies, Inc.

import { produceAsyncThunkTester, produceStateSetter } from "../../../src"
import { merge, prop } from "../../../src/utils"
import { Order, ordersSlice, OrdersState, Product } from "../../orders/slice"
import { ordersThunks } from "../../orders/thunks"
import { api } from "../api"

/* Async Thunk Unit Tests
 *
 * Async thunks are a little trickier to unit test because the core
 * logic in your async thunk payload creator and reducers tend to
 * get a bit buried if you follow the best practices for using RTK.
 * Even if you modularize the thunk case reducers using the utilities
 * in this package, it is still hard to get to them for testing as
 * they are wrapped in the builder functions.
 *
 * One approach is to use a minimal store that just includes the slice
 * you are testing and then use that to test the thunks' results and
 * changes to state.  That's the approach taken in this file with the
 * help of the `produceAsyncThunkTester` utility that simplifies the
 * creation and utilization of the store.
 */

let testAsyncThunk = produceAsyncThunkTester(ordersSlice)

jest.mock("../api")
const mockApi = api as jest.Mocked<typeof api>

const mockOrder = {
  id: "372hej",
  productType: Product.fdd,
  customerId: 33,
  datePlaced: "2022-04-11"
}

beforeEach(() => {
  // create a new store with fresh state before each test
  testAsyncThunk = produceAsyncThunkTester(
    ordersSlice,
    merge(
      produceStateSetter<OrdersState>()("orderQueue", [
        {
          id: "8739hj3h",
          productType: Product.fdd,
          customerId: 32,
          datePlaced: "2022-04-10"
        }
      ]),
      produceStateSetter<OrdersState>()("availableProducts", [Product.fdd])
    )
  )
  jest.clearAllMocks()
})

describe(`${ordersThunks.getOrder.typePrefix}`, () => {
  it("gets new orders and adds to queue", async () => {
    mockApi.getOrder.mockResolvedValue(mockOrder)
    await testAsyncThunk(ordersThunks.getOrder())
    const { result, state } = await testAsyncThunk(ordersThunks.getOrder())

    expect(Object.keys(result)).toContain("customerId")
    expect(state.orderQueue.length).toBe(3)
  })

  it("does not add orders for products that aren't available", async () => {
    mockApi.getOrder.mockResolvedValue(
      prop<Order>()("productType")(Product.crt)(mockOrder)
    )
    const { result, state } = await testAsyncThunk(
      ordersThunks.getOrder(),
      true
    )
    expect(result).toEqual(
      expect.objectContaining({ productType: Product.crt })
    )
    expect(state.orderQueue.length).toBe(1)
  })

  it("adds errors from reject promises to unexpected errors in state", async () => {
    mockApi.getOrder.mockRejectedValue("Network failure")
    const { state } = await testAsyncThunk(ordersThunks.getOrder(), false)
    expect(state.unexpectedErrors[0]).toEqual("Getting order failed")
  })

  it("adds errors from throws to unexpected errors in state", async () => {
    mockApi.getOrder.mockImplementation(() => {
      throw new Error("Test error")
    })
    const { state } = await testAsyncThunk(ordersThunks.getOrder(), false)
    expect(state.unexpectedErrors[0]).toEqual("Getting order failed")
  })
})
