// Copyright 2022 MFB Technologies, Inc.
/**
 * Call this function with a type parameter that gives it the slice's
 * state.  It returns a function that can be used to create properly
 * typed case reducers that can be passed into the `reducers` property
 * of `createSlice`'s argument.
 *
 * @example
 * const createCounterReducer = produceCaseReducer<CounterState>()
 * export const counterReducers = {
 *   someReducer: createCounterReducer((state,action) => {
 *     // reducer logic here
 *   })
 *  }
 *
 * //in slice.ts
 * createSlice({
 *   ...
 *   reducers: createCounterReducer
 * })
 *
 */
export var produceCaseReducer = function () {
    return function (cr) { return cr; };
};
