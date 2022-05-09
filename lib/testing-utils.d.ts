import { AsyncThunkAction, Reducer } from "@reduxjs/toolkit";
/**
 * Create mock state from an initial state and a series of transformer functions.
 *
 * The first call to this function passes in the root state
 * object that will be the base for producing mock state.  The second
 * call passes in an array of transformers that will change various
 * properties of the state object to produce a new object.
 */
export declare const produceMockState: <TState>(state: TState) => <TTransformers extends Array<(state: TState) => TState>>(transformers: TTransformers) => TState;
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
export declare const produceStateSetter: <TState extends Record<string, any>>() => <TKey extends keyof TState>(key: TKey, f: ((value: TState[TKey]) => TState[TKey]) | TState[TKey]) => (state: TState) => TState;
declare type FakeSlice<TState> = {
    name: string;
    reducer: Reducer<TState>;
    getInitialState: () => TState;
};
declare type StateFromSlice<T extends FakeSlice<any>> = T extends FakeSlice<infer X> ? X : never;
declare type ResultFromUnwrap<TArg extends AsyncThunkAction<any, any, any>, U extends boolean | undefined> = [U] extends [false] ? UnwrapPromise<ReturnType<TArg>> : [U] extends [true] ? GetReturned<TArg> : GetReturned<TArg>;
declare type GetReturned<T extends AsyncThunkAction<any, any, any>> = T extends AsyncThunkAction<infer X, any, any> ? X : never;
declare type UnwrapPromise<T extends Promise<any>> = T extends Promise<infer X> ? X : never;
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
export declare function produceAsyncThunkTester<TSlice extends FakeSlice<any>>(slice: TSlice, initialStateOrTransform?: TSlice extends FakeSlice<infer TState> ? TState | ((state: TState) => TState) : never): <TArg extends AsyncThunkAction<any, any, any>, U extends boolean | undefined>(arg: TArg, unwrap?: U | undefined) => Promise<{
    result: ResultFromUnwrap<TArg, U>;
    state: StateFromSlice<TSlice>;
}>;
export {};
