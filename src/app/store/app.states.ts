import { createFeatureSelector } from '@ngrx/store';
import * as auth from './reducers/auth.reducers';
import * as cart from './reducers/cart.reducers';

export interface AppState {
  authState: auth.State;
  cartState: cart.State;
}

export const reducers = {
  auth: auth.reducer,
  cart: cart.reducer
};

export const selectAuthState = createFeatureSelector<AppState>('auth');
export const selectCartState = createFeatureSelector<AppState>('cart');
