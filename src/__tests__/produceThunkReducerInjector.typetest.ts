import { createAsyncThunk } from "@reduxjs/toolkit"
import { produceThunkReducerInjector } from ".."

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

async function doAsync(x: number): Promise<string> {
  return Promise.resolve("test string")
}

const testThunk = createAsyncThunk<string, number, { rejectValue: string }>(
  "slice/testThunk",
  async (x, thunkApi) => {
    try {
      return await doAsync(x)
    } catch (error) {
      return thunkApi.rejectWithValue("Error")
    }
  }
)

// correct typing
{
  const sliceThunkReducerInjector = produceThunkReducerInjector<SliceState>()
  const injectSliceThunkReducers = sliceThunkReducerInjector(builder => {
    builder.addCase(testThunk.fulfilled, (state, action) => {
      let state2: SliceState = state
      //@ts-expect-error state has a different shape than state3
      let state3: { propX: number } = state
      let x: string = action.payload
      //@ts-expect-error action payload is not of type number
      let y: number = action.payload
    })
  })
}

// missing slice state type -- injector is never
{
  const sliceThunkReducerInjector = produceThunkReducerInjector()
  //@ts-expect-error
  const injectSliceThunkReducers = sliceThunkReducerInjector(builder => {})
}
