declare type Selector<S, R> = (state: S) => R;
declare type SelectorCreator<A, S, R> = (arg: A) => Selector<S, R>;
/**
 * Call this function with a type parameter that gives it your application's root state.
 * That returns a function that you call with the name of the slice for which you want
 * to create selectors.  That then returns a function that can be passed sets of selectors
 * and selectorCreators, respectively, that are written against your slice's state.  They
 * will automatically be converted to a single object containing the same selectors
 * applied to your application's root state.
 *
 * @example
 * const produceCounterSelectors = produceRootSelectors<RootState()
 * const createCounterSelectors = produceCounterSelectors(counterSlice.name)
 * const counterSelectors = createCounterSelectors(counterPlainSelectors, counterSelectorCreators)
 *
 * @example <caption> Curried calling style</caption>
 * const counterSelectors = produceRootSelectors<RootState>()(counterSlice.name)(
 *   counterPlainSelectors, counterSelectorCreators
 * )
 */
export declare function produceRootSelectors<TRootState>(): <TSliceKey extends keyof TRootState>(sliceKey: TSliceKey) => <TSelectors extends Record<string, Selector<TRootState[TSliceKey], any>>, TSelectorCreators extends Record<string, SelectorCreator<any, TRootState[TSliceKey], any>>>(selectors: TSelectors, selectorCreators: TSelectorCreators) => { [K in keyof TSelectors]: TSelectors[K] extends Selector<TRootState[TSliceKey], infer R> ? (rootState: TRootState) => R : never; } & { [K_1 in keyof TSelectorCreators]: TSelectorCreators[K_1] extends SelectorCreator<infer A, TRootState[TSliceKey], infer R_1> ? (arg: A) => (rootState: TRootState) => R_1 : never; };
export {};
