// Copyright 2022 MFB Technologies, Inc.

import { AsyncThunkAction, configureStore, Reducer } from "@reduxjs/toolkit"
import { merge } from "./utils"

/**
 * Create mock state from an initial state and a series of transformer functions.
 *
 * The first call to this function passes in the root state
 * object that will be the base for producing mock state.  The second
 * call passes in an array of transformers that will change various
 * properties of the state object to produce a new object.
 */
export const produceMockState: <TState>(
  state: TState
) => <TTransformers extends Array<(state: TState) => TState>>(
  transformers: TTransformers
) => TState = state => {
  return transformers => {
    return merge(...transformers)(state)
  }
}

/**
 * Create a transformer to change a state property.
 *
 * The first call to this function simply passes in a type
 * parameter that specifies the type of object on which properties
 * are going to be set. That returns a function that accepts the key of the
 * property to be changed and either a new value or a function to
 * transform the old value. It then returns a function that will transform
 * a state object accordingly.
 */
export const produceStateSetter: <TState extends Record<string, any>>() => <
  TKey extends keyof TState
>(
  key: TKey,
  f: ((value: TState[TKey]) => TState[TKey]) | TState[TKey]
) => (state: TState) => TState = () => {
  return (key, f) => {
    return state => {
      const newState = { ...state }
      if (typeof f === "function") {
        //we know this has resolved as a function
        newState[key] = (f as any)(state[key])
      } else {
        newState[key] = f
      }
      return newState
    }
  }
}

type FakeSlice<TState> = {
  name: string
  reducer: Reducer<TState>
  getInitialState: () => TState
}

type StateFromSlice<T extends FakeSlice<any>> = T extends FakeSlice<infer X>
  ? X
  : never

type ResultFromUnwrap<
  TArg extends AsyncThunkAction<any, any, any>,
  U extends boolean | undefined
> = [U] extends [false]
  ? UnwrapPromise<ReturnType<TArg>>
  : [U] extends [true]
  ? GetReturned<TArg>
  : GetReturned<TArg>

type GetReturned<T extends AsyncThunkAction<any, any, any>> =
  T extends AsyncThunkAction<infer X, any, any> ? X : never

type UnwrapPromise<T extends Promise<any>> = T extends Promise<infer X>
  ? X
  : never

/**
 * Test async thunks with an actual store.
 *
 * Function that takes (a) a slice and (b) an initial state object or
 * a function to transform the initial state of the slice.  It returns
 * a function that will accept the return of an async thunk and will
 * return both the update state and the result of the thunk.  By default
 * the result of the thunk will be unwrapped (which means it will throw
 * if the thunk returns an error).  This behavior can be turned off by
 * passing 'false' as the second argument.
 */
export function produceAsyncThunkTester<TSlice extends FakeSlice<any>>(
  slice: TSlice,
  initialStateOrTransform?: TSlice extends FakeSlice<infer TState>
    ? TState | ((state: TState) => TState)
    : never
) {
  let preloadedSliceState: StateFromSlice<TSlice> | undefined
  if (typeof initialStateOrTransform === "function") {
    //we know this has resolved as a function
    preloadedSliceState = (initialStateOrTransform as any)(
      slice.getInitialState()
    )
  } else {
    preloadedSliceState = initialStateOrTransform as
      | StateFromSlice<TSlice>
      | undefined
  }

  const store = configureStore({
    reducer: {
      [slice.name]: slice.reducer
    },
    preloadedState: preloadedSliceState
      ? { [slice.name]: preloadedSliceState }
      : (undefined as any)
  })

  return async <
    TArg extends AsyncThunkAction<any, any, any>,
    U extends boolean | undefined
  >(
    arg: TArg,
    unwrap?: U
  ): Promise<{
    result: ResultFromUnwrap<TArg, U>
    state: StateFromSlice<TSlice>
  }> => {
    const shouldUnwrap = unwrap ?? true
    if (shouldUnwrap) {
      const unwrappedResult = await store.dispatch(arg).unwrap()
      return {
        result: unwrappedResult,
        state: store.getState()[slice.name]
      }
    } else {
      const plainResult = await store.dispatch(arg)
      // the return type of the function will handle setting
      // the type
      return {
        result: plainResult as any,
        state: store.getState()[slice.name]
      }
    }
  }
}
