import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../models/Product.model';
import { CartService } from '../services/cart.service';
import { UpdateCart } from '../store/actions/cart.actions';
import { AppState, selectAuthState, selectCartState } from '../store/app.states';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartState: Observable<any>
  userState: Observable<any>
  userID: number | null;
  cartID: number | null;
  products: any = [];

  constructor(private store: Store<AppState>, private cartService: CartService) {
    this.cartState = this.store.select(selectCartState);
    this.userState = this.store.select(selectAuthState);
  }

  ngOnInit(): void {
    this.cartState.subscribe((state) => {
      this.products = state.products;
    });
    var userSub = this.userState.subscribe((state) => {
      this.userID = state.user.ID;
      this.cartService.getUserCart(this.userID)
        .subscribe(
          responseData => {
            this.cartID = responseData.body['ID'];
          }, error => {
            console.log(error);
          }
        )
    });

    userSub.unsubscribe();
  }

  removeFromCart(index: number) {
    var userSub = this.userState.subscribe(
      state => {
        if (state.isAuthenticated) {
          // remove product from users cart
          this.cartService.removeFromCart({ cartID: this.cartID, productID: this.products[index].ID })
            .subscribe(
              responseData => {
                console.log(responseData);
                this.products.splice(index, 1);
                this.store.dispatch(new UpdateCart({ products: this.products }));
              }, error => {
                console.log(error);
              }
            )
        } else {
          this.products.splice(index, 1);
          this.store.dispatch(new UpdateCart({ products: this.products }));
        }
      }, error => {
        console.log(error);
      }
    )

    userSub.unsubscribe();
  }
}
