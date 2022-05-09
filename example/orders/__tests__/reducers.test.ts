// Copyright 2022 MFB Technologies, Inc.

import { produceMockState, produceStateSetter } from "../../../src"
import { initialOrdersState, ordersSlice, OrdersState, Product } from "../slice"
import { ordersReducers } from "../reducers"

/*
 * Case Reducer Unit Tests
 *
 * Unit tests can be a good way for making sure the logic of specific
 * case reducers is working correctly.  Nothing prevents you from
 * testing the logic using integration tests, but unit tests can be easier
 * especially if you want to set up some complicated starting state.
 * (Even that can be achieved fairly easily in an integration test
 * using the `preloadedState` parameter of `configureStore`. Though
 * technically, at that point you aren't testing your app's store anymore.)
 *
 * Having your case reducers modularized can make this kind of unit testing
 * easier and more organized.  That said, it's fairly easy to do it
 * without modularization as well, by just using the `caseReducers` property
 * that is part of every slice created by RTK.
 *
 * Note that because case reducers have not had immer applied to them at
 * this stage (or when they are a property of an RTK slice), you have
 * to test your logic as if state was mutable, as is done here.
 *
 * These tests use the functional `mockStateProducer` and `stateSetterProducer`
 * utilities provided by this package to create fresh copies of state
 * configured for each test.  There are many other ways to achieve that,
 * including using immer.
 */

const { productAdded, productRemoved } = ordersReducers
// taking advantage of the action creators automatically generated
const { actions } = ordersSlice
const createMockState = produceMockState(initialOrdersState)
const set = produceStateSetter<OrdersState>()

describe("productAdded", () => {
  it("adds product type if not already available", () => {
    const mockState = createMockState([set("availableProducts", [])])

    productAdded(mockState, actions.productAdded(Product.floppy))

    expect(mockState.availableProducts.length).toEqual(1)
    expect(mockState.availableProducts.includes(Product.floppy)).toBeTruthy()
  })

  it("does not add a product type if already available", () => {
    const mockState = createMockState([
      set("availableProducts", [Product.floppy])
    ])

    productAdded(mockState, actions.productAdded(Product.floppy))

    expect(mockState.availableProducts.length).toEqual(1)
  })
})

describe("productRemoved", () => {
  it("removes product type from available products", () => {
    const mockState = createMockState([
      set("availableProducts", _ => [Product.floppy])
    ])

    productRemoved(mockState, actions.productAdded(Product.floppy))

    expect(mockState.availableProducts.length).toEqual(0)
  })

  it("removes products of that type from order queue", () => {
    const mockState = createMockState([
      set("availableProducts", [Product.floppy, Product.fdd]),
      set("orderQueue", [
        {
          id: "asdf8",
          customerId: 3,
          productType: Product.floppy,
          datePlaced: "2021-03-24"
        },
        {
          id: "lc73s",
          customerId: 7,
          productType: Product.fdd,
          datePlaced: "2021-03-24"
        }
      ])
    ])

    productRemoved(mockState, actions.productAdded(Product.floppy))

    expect(mockState.availableProducts.length).toEqual(1)
    expect(mockState.orderQueue.length).toEqual(1)
  })
})
