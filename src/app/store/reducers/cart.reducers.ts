import { Product } from "src/app/models/Product.model";
import { CartActionTypes, All } from "../actions/cart.actions";

// define Cart State Structure through interface
export interface State {
  userID: number | null;

  cartID: number | null;

  products: Product[] | null;

  errorMessage: string | null;
}

// Define the initial state of the cart
export const initialState: State = {
  userID: null,
  cartID: null,
  products: [],
  errorMessage: null
}

// Reducer function to define change actions in cart state
export function reducer(state = initialState, action: All): State {
  // define each action type and appropriate response
  switch (action.type) {
    case CartActionTypes.UPDATECART: {
      return {
        ...state,
        userID: action.payload.userID,
        cartID: action.payload.cartID,
        products: action.payload.products
      }
    }

    case CartActionTypes.REFRESH: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}
