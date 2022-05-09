// Copyright 2022 MFB Technologies, Inc.

type Selector<S, R> = (state: S) => R
type SelectorCreator<A, S, R> = (arg: A) => Selector<S, R>

function produceRootSelector<TRootState>(): <TKey extends keyof TRootState>(
  sliceKey: TKey
) => <TResult>(
  sliceSelector: Selector<TRootState[TKey], TResult>
) => Selector<TRootState, TResult> {
  return sliceKey => {
    return sliceSelector => {
      return rootState => {
        const scopedState = rootState[sliceKey]
        return sliceSelector(scopedState)
      }
    }
  }
}

function produceRootSelectorCreator<TRootState>(): <
  TKey extends keyof TRootState
>(
  sliceKey: TKey
) => <TArg, TResult>(
  selectorFunction: SelectorCreator<TArg, TRootState[TKey], TResult>
) => SelectorCreator<TArg, TRootState, TResult> {
  return sliceKey => {
    return sliceSelectorFunction => {
      return arg => {
        return rootState => {
          const scopedState = rootState[sliceKey]
          return sliceSelectorFunction(arg)(scopedState)
        }
      }
    }
  }
}

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
 * export const counterSelectors = createCounterSelectors(counterPlainSelectors, counterSelectorCreators)
 *
 * @example <caption> Curried calling style</caption>
 * export const counterSelectors = produceRootSelectors<RootState>()(counterSlice.name)(
 *   counterPlainSelectors, counterSelectorCreators
 * )
 */
export function produceRootSelectors<TRootState>() {
  return function <TSliceKey extends keyof TRootState>(sliceKey: TSliceKey) {
    return function <
      TSelectors extends Record<string, Selector<TRootState[TSliceKey], any>>,
      TSelectorCreators extends Record<
        string,
        SelectorCreator<any, TRootState[TSliceKey], any>
      >
    >(
      selectors: TSelectors,
      selectorCreators: TSelectorCreators
    ): {
      [K in keyof TSelectors]: TSelectors[K] extends Selector<
        TRootState[TSliceKey],
        infer R
      >
        ? // Not using the type alias here so the IDE output is more explicit
          (rootState: TRootState) => R
        : never
    } & {
      [K in keyof TSelectorCreators]: TSelectorCreators[K] extends SelectorCreator<
        infer A,
        TRootState[TSliceKey],
        infer R
      >
        ? // Not using the type alias here so the IDE output is more explicit
          (arg: A) => (rootState: TRootState) => R
        : never
    } {
      const prs = produceRootSelector<TRootState>()(sliceKey)
      const prsc = produceRootSelectorCreator<TRootState>()(sliceKey)
      const rootSelectors = Object.entries(selectors).map(([a, b]) => [
        a,
        prs(b)
      ])
      const rootSelectorCreators = Object.entries(selectorCreators).map(
        ([a, b]) => [a, prsc(b)]
      )
      return {
        ...Object.fromEntries(rootSelectors),
        ...Object.fromEntries(rootSelectorCreators)
      }
    }
  }
}
