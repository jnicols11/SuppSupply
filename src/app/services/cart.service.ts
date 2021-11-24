import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UpdateCart } from '../store/actions/cart.actions';
import { selectCartState } from '../store/app.states';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseURL: string = 'http://localhost:3000';
  cartID: number;
  cartState: Observable<any>;

  constructor(private http: HttpClient, private store: Store) {
    this.cartState = this.store.select(selectCartState);
  }

  getUserCart(userID: number) {
    return this.http.get(
      this.baseURL + '/cart/user/' + userID,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  getCartProducts(userID: number) {
    return this.http.get(
      this.baseURL + '/cart/products/' + userID,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  createCart(userID: number) {
    return this.http.post(
      this.baseURL + '/cart/create/',
      userID,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  addToCart(info: { cartID, productID }) {
    return this.http.post(
      this.baseURL + '/cart/add',
      info,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  removeFromCart(info: { cartID, productID }) {
    console.log(info);
    return this.http.post(
      this.baseURL + '/cart/remove',
      info,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  setCart(userID: number) {
    // get cart ID
    this.getUserCart(userID)
      .subscribe(
        responseData => {
          this.cartID = responseData.body['ID'];
          // add products from state to user cart
          var cartSub = this.cartState.subscribe(
            state => {
              if (state.products.length > 0) {
                this.getCartProducts(this.cartID)
                  .subscribe(
                    productData => {
                      let products: any = [];
                      products = productData.body;

                      state.products.forEach(product => {
                        products.push(product);
                      })
                      this.store.dispatch(new UpdateCart({ products: products, cartID: this.cartID, userID: userID }));
                    }, error => {
                      console.log(error);
                    }
                  )

                // add each product from state to users cart
                state.products.forEach(product => {
                  this.addToCart({ cartID: this.cartID, productID: product.ID })
                    .subscribe(
                      responseData => {
                        console.log(responseData);
                      }, error => {
                        console.log(error);
                      }
                    )
                })
              } else {
                // get all products in the cart
                console.log('getting products');
                this.getCartProducts(this.cartID)
                  .subscribe(
                    productData => {
                      this.store.dispatch(new UpdateCart({ products: productData.body, cartID: this.cartID, userID: userID }));
                    }, error => {
                      console.log(error);
                    }
                  )
              }
            }, error => {
              console.log(error);
            }
          )
          // unsubscribe from subscriptions
          cartSub.unsubscribe();
        }, error => {
          console.log(error);
        }
      )

  }
}
