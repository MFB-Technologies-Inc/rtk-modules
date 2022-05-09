// Copyright 2022 MFB Technologies, Inc.

import { produceRootSelectors } from "../produceRootSelectors"

type SliceState = {
  prop1: number
  prop2: string
  prop3: string | number
  prop4: Record<string, any>
  prop5?: number
  prop6: boolean
  prop7: {
    sub1: number
    sub2?: boolean
    sub3?: string | number
  }
  prop8: string[]
}

type RootState = {
  testSlice: SliceState
  otherSlice: { other: number }
}

const plainSelectors = {
  getProp1: (state: SliceState) => state.prop1,
  getprop5: (state: SliceState) => state.prop5
}

const selectorCreators = {
  getProp7Field: (k: keyof SliceState["prop7"]) => (state: SliceState) =>
    state.prop7[k],
  getProp8Element: (i: number) => (state: SliceState) => state.prop8[i]
}

// correct typing
{
  const selectors = produceRootSelectors<RootState>()("testSlice")(
    plainSelectors,
    selectorCreators
  )
  selectors.getProp1
  selectors.getprop5
  selectors.getProp7Field("sub2")
  //@ts-expect-error - b2 is not a valid field name
  selectors.getProp7Field("b2")
  selectors.getProp8Element(2)
  //@ts-expect-error - notASelector is not a valid selector name
  selectors.notASelector
}

// correct typing - empty object for plainSelectors
{
  const selectors = produceRootSelectors<RootState>()("testSlice")(
    {},
    selectorCreators
  )
  //@ts-expect-error
  selectors.getProp1
  selectors.getProp7Field
  selectors.getProp8Element
}

// correct typing - empty object for selectorCreators
{
  const selectors = produceRootSelectors<RootState>()("testSlice")(
    plainSelectors,
    {}
  )
  selectors.getProp1
  selectors.getprop5
  //@ts-expect-error
  selectors.notASelector
}

// missing root state type -- keyname is never
{
  //@ts-expect-error
  const selectors = produceRootSelectors()("testSlice")(
    plainSelectors,
    selectorCreators
  )
}
