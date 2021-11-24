import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../models/Product.model';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { UpdateCart } from '../store/actions/cart.actions';
import { AppState, selectAuthState, selectCartState } from '../store/app.states';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  faStar = faStar;
  cartState: Observable<any>;
  authState: Observable<any>;
  stateProducts: any = [];
  isAuthenticated = false;
  cartID = null;
  userID = null;
  selectedProduct: Product = new Product(1, 'Vitality Immuno Enhancer', 'Look no further! All in one supplement designed to cover all your nutritional basis to live a more active and healthy lifestyle. Vitality immuno enhancer Combines vitamins, minerals and herbs to nourish your immune system, enhance collagen production', 39.95, 1, '1.png');

  constructor(private service: ProductService, private cartService: CartService, private store: Store<AppState>, private router: Router) {
    this.cartState = this.store.select(selectCartState);
    this.authState = this.store.select(selectAuthState);
  }

  ngOnInit(): void {
    this.setState();
  }

  addToCart() {
    if (this.isAuthenticated) {
      let info = { cartID: this.cartID, productID: this.selectedProduct.ID };

      // User is logged in, add item to cart in DB
      this.cartService.addToCart(info)
        .subscribe(
          response => {
            console.log(response);

            this.stateProducts.push(this.selectedProduct);

            this.store.dispatch(new UpdateCart({ cartID: this.cartID, userID: this.userID, products: this.stateProducts }));

            this.router.navigate(['/cart']);
          }, error => {
            console.log(error);
          }
        )
    } else {
      // User is not logged in
      this.stateProducts.push(this.selectedProduct);

      this.store.dispatch(new UpdateCart({ products: this.stateProducts }));

      this.router.navigate(['/cart']);
    }

  }

  private setState() {
    this.cartState.subscribe(
      state => {
        this.stateProducts = state.products;
        this.cartID = state.cartID;
        this.userID = state.userID;
      }
    )

    this.authState.subscribe(
      state => {
        this.isAuthenticated = state.isAuthenticated;
      }
    )
  }

}


