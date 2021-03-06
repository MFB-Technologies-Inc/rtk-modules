// Copyright 2022 MFB Technologies, Inc.

import { ActionReducerMapBuilder } from "@reduxjs/toolkit"

/**
 * Call this function with a type parameter that gives it the slice's
 * state.  It returns a function that can be used to create properly
 * typed thunk case reducers using the same builder patter provided by
 * the `extraReducers` property of `createSlice`'s argument.  The end
 * result is a function that can be called inside `createSlice` to inject
 * the extra reducers built.
 *
 * @example
 * const createCounterThunkReducerInjector = produceThunkReducerInjector<CounterState>()
 *
 * export const injectReducers = createCounterThunkReducerInjector( builder => {
 *   builder.addCase(someAsyncThunk.fulfilled, (state, action) => {
 *     // case reducer code here
 *   })
 * }
 *
 * //in slice.ts
 * createSlice({
 *   ...
 *   extraReducers: build => injectReducers(build)
 * })
 *
 * @example <caption>Curried calling style</caption>
 * export const injectReducers = produceThunkReducerInjector<CounterState>()( builder => {
 *   builder.addCase(someAsyncThunk.fulfilled, (state, action) => {
 *     // case reducer code here
 *   })
 * }
 */
export const produceThunkReducerInjector = <TSliceState = never>() => {
  return <TResult>(
      injector: [TSliceState] extends [never]
        ? never
        : (builder: ActionReducerMapBuilder<TSliceState>) => TResult
    ) =>
    (builder: ActionReducerMapBuilder<TSliceState>) =>
      injector(builder)
}
