import { nanoid } from "@reduxjs/toolkit"
import { Order, Product } from "./slice"

export enum Status {
  success,
  failure
}

export const api = {
  async getOrder(): Promise<Order> {
    const order: Order = {
      id: nanoid(),
      customerId: 7,
      productType: Product.floppy,
      datePlaced: new Date(2022, 4, 3).toString()
    }
    return Promise.resolve(order)
  },
  async ship(order: Order): Promise<Status> {
    if (order.customerId === 13) {
      return Promise.resolve(Status.failure)
    }
    return Promise.resolve(Status.success)
  }
}
