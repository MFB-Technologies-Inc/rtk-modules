# rtk-modules

Library of helper utilities for splitting Redux case reducers, thunks, and selectors
across multiple file modules.  Particularly useful in conjunction with Redux Toolkit's
`createSlice` and React Redux's `useSelector`

## Rationale

Redux, and in particular Redux Toolkit, encourage breaking redux store's up into feature-
specific "slices."  In some code bases, it is desirable to further break up those slices
into modules containing the feature-specific case reducers, selectors, and async thunks.
This can reduce file size, make testing easier, and even allow for isolating individual
redux slices in their own npm packages.

This library provides some helper functions to make this process easier while preserving
the excellent type safety and type inferences provided by Redux Toolkit.  It also provides
some testing utilities to make testing these modularized files easier.

## Helper Utilities

### `produceCaseReducer`

A function to make it easier to create an object full of named case reducers thatcan be passed to the `reducers` property of `createSlice`'s argument.

```typescript
 const createCounterReducer = produceCaseReducer<CounterState>()

 export const counterReducers = {
   someReducer: createCounterReducer((state,action) => {
     // reducer logic here
   })
  }
 
 //in slice.ts
 createSlice({
   ...
   reducers: createCounterReducers
 })
```

### `produceThunkReducerInjector`

A function to make it easier to create asyncThunk case reducers in the same file
you make the asyncThunks themselves, but following the same `builder` pattern 
used by `createSlice`

```typescript
 const createCounterThunkReducerInjector = produceThunkReducerInjector<CounterState>()
 
 export const injectReducers = createCounterThunkReducerInjector( builder => {
   builder.addCase(someAsyncThunk.fulfilled, (state, action) => {
     // case reducer code here
   })
 }
 
 //in slice.ts
 createSlice({
   ...
   extraReducers: build => injectReducers(build)
 })
```

### `produceRootSelectors`

A function that can turn selectors and selector creators written against slice
state into selectors and selector creators, respectively, that operate against
root state.

```typescript
const counterPlainSelectors = {
  aSelector: (state:CounterState) => {
    //select some state
  }
}

const counterSelectorCreators = {
  aSelectorCreator: (x:number) => (state:CounterState) => { 
    //select some state 
  }
}

export const counterSelectors = produceRootSelectors<RootState>()(counterSlice.name)(
   counterPlainSelectors, counterSelectorCreators
)

// in a component
const mySelection = useSelector(counterSelectors.aSelector)
const myOtherSelection = useSelector(counterSelectors.aSelector(4))
 ```

## Testing Utilities

### `produceAsyncThunkTester`

A function to make it easier to test async thunks using an actual store
containing the relevant slice.

```typescript
// creates a mock store containing just the slice and with state configured
// based on an injected initial state or a function that transforms the 
// slices initial state
let testAsyncThunk = produceAsyncThunkTester(counterSlice, injectedStartingState)

it("example test", async () => {
  // runs the passed in async thunk through the store and returns the result
  // and modified state
  const { result, state } = await testAsyncThunk(counterThunks.someAsyncThunk())

  expect(Object.keys(result)).toContain("expectedString")
  expect(state.someState.length).toBe(3)
})
```

### `produceMockState` and `produceStateSetter`

Lightweight functional programming utilities to create mock state from an initial
state using a set of transformer functions.  `produceStateSetter` generates the
transformer functions, and `produceMockState` composes them together and uses 
them to transform an initial state object.

```typescript
const set = produceStateSetter<OrdersState>()

it("example test", () => {
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
  ])(initialOrdersState)
  /// continue with act and assertions of test
})
```
