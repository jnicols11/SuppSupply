import { Action } from "@ngrx/store";

// define cart action types to be handled by reducer
export enum CartActionTypes {
  UPDATECART = '[Cart] Update Cart',
  ADDTOCART = '[Cart] Add to Cart',
  REFRESH = '[Cart] Refresh',
}

// define class action to update the carts state
export class UpdateCart implements Action {
  readonly type = CartActionTypes.UPDATECART;
  constructor(public payload: any) { }
}

export class Refresh implements Action {
  readonly type = CartActionTypes.REFRESH;
}

export type All =
  | UpdateCart
  | Refresh
