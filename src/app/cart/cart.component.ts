import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
  price: any;

  constructor(
    private store: Store<AppState>,
    private cartService: CartService,
    private router: Router
  ) {
    this.cartState = this.store.select(selectCartState);
    this.userState = this.store.select(selectAuthState);
  }

  ngOnInit(): void {
    this.cartState.subscribe((state) => {
      console.log(state);
      this.products = state.products;
      this.cartID = state.cartID;
      this.calculatePrice();
    });
    var userSub = this.userState.subscribe((state) => {
      this.userID = state.user.ID;
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
                this.store.dispatch(new UpdateCart({ cartID: this.cartID, userID: this.userID, products: this.products }));
              }, error => {
                console.log(error);
              }
            )
        } else {
          this.products.splice(index, 1);
          this.store.dispatch(new UpdateCart({ cartID: this.cartID, userID: this.userID, products: this.products }));
        }
      }, error => {
        console.log(error);
      }
    )

    userSub.unsubscribe();
  }

  onCheckout() {
    // check if user is logged in
    if (this.userID == null) {
      // No user logged in (prompt user to log in in order to continue to checkout
      this.router.navigate(['/login'], { queryParams: { action: 'checkout' }})
    } else {
      // User is logged in (bring user to checkout page)
      this.router.navigate(['/checkout']);
    }
  }

  private calculatePrice() {
    let total = 0;
    this.products.forEach(product => {
      total += product.price;
    });

    this.price = total;
  }
}
