import { createSlice } from "@reduxjs/toolkit"
import { produceCaseReducer } from "../produceCaseReducer"

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
}

// Correct typing
{
  const produceSliceCaseReducer = produceCaseReducer<SliceState>()

  const testReducers = {
    testReducer: produceSliceCaseReducer<number>((state, action) => {
      let state2: SliceState = state
      //@ts-expect-error - propX not a valid state property
      let state3: { propX: number } = state
      let x: number = action.payload
      //@ts-expect-error - action.payload is not type string
      let y: string = action.payload
    })
  }

  const testSlice = createSlice({
    name: "testSlice",
    initialState: {
      prop1: 0,
      prop2: "",
      prop3: 0,
      prop4: {},
      prop6: false,
      prop7: {
        sub1: 0
      }
    } as SliceState,
    reducers: testReducers
  })

  createSlice({
    name: "testSlice",
    initialState: {
      prop1: 0,
      prop2: "",
      prop3: 0,
      prop4: {},
      prop6: false,
      prop7: {
        sub1: 0
      }
    } as SliceState,
    //@ts-expect-error - reducers needs a properly typed reducers object
    reducers: { testReducer: "" }
  })
}

// No state argument -- state type is unknown
{
  const produceSliceCaseReducer = produceCaseReducer()

  const testReducers = {
    testReducer: produceSliceCaseReducer<number>((state, action) => {
      //@ts-expect-error
      let state2: SliceState = state
    })
  }
}

// No payload argument -- case reducer set to never
{
  const produceSliceCaseReducer = produceCaseReducer<SliceState>()

  const testReducers = {
    //@ts-expect-error
    testReducer: produceSliceCaseReducer((state, action) => {})
  }
}
