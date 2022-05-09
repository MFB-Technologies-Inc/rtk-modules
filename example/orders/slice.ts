import { createSlice } from "@reduxjs/toolkit"
import { ordersReducers } from "./reducers"
import { injectOrderThunkReducers } from "./thunks"

export type Order = {
  id: string
  customerId: number
  productType: Product
  datePlaced: string
}

export enum Product {
  floppy = "Floppy Disk",
  fdd = "Floppy Disk Drive",
  crt = "Cathode Ray Tube",
  dotMatrix = "DotMatrix Printer",
  scsi = "SCSI Adapter"
}

export type OrdersState = {
  availableProducts: Product[]
  orderQueue: Order[]
  lastShipDate: string | null
  numItemsLastShipped: number
  shippingError?: string
  failedOrders: number
  unexpectedErrors: string[]
}

export const initialOrdersState: Readonly<OrdersState> = {
  availableProducts: [Product.floppy, Product.fdd, Product.crt],
  orderQueue: [],
  lastShipDate: null,
  numItemsLastShipped: 0,
  failedOrders: 0,
  unexpectedErrors: []
}

export const ordersSlice = createSlice({
  name: "orders",
  initialState: initialOrdersState,
  reducers: ordersReducers,
  extraReducers: builder => injectOrderThunkReducers(builder)
})
