// Copyright 2022 MFB Technologies, Inc.

import { CaseReducer, PayloadAction } from "@reduxjs/toolkit"

/**
 * Call this function with a type parameter that gives it the slice's
 * state.  It returns a function that can be used to create properly
 * typed case reducers that can be passed into the `reducers` property
 * of `createSlice`'s argument.
 *
 * @example
 * const createCounterReducer = produceCaseReducer<CounterState>()
 *
 * export const counterReducers = {
 *   someReducer: createCounterReducer((state,action) => {
 *     // reducer logic here
 *   })
 *  }
 *
 * //in slice.ts
 * createSlice({
 *   ...
 *   reducers: createCounterReducers
 * })
 *
 */
export const produceCaseReducer = <TSliceState>() => {
  return <TPayloadContent = never>(
    cr: [TPayloadContent] extends [never]
      ? never
      : CaseReducer<TSliceState, PayloadAction<TPayloadContent>>
  ) => cr
}
