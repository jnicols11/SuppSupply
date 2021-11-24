import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../models/Product.model';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { UpdateCart } from '../store/actions/cart.actions';
import { AppState, selectAuthState, selectCartState } from '../store/app.states';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any = [];
  cartState: Observable<any>;
  authState: Observable<any>;
  selectedProduct: Product = null;
  stateProducts: any = [];
  isAuthenticated = false;
  cartID = null;
  userID = null;

  constructor(private service: ProductService, private cartService: CartService, private store: Store<AppState>, private router: Router) {
    this.cartState = this.store.select(selectCartState);
    this.authState = this.store.select(selectAuthState);
  }

  ngOnInit(): void {
    this.populateProducts();
    this.setState();
  }

  viewProduct(product: any) {
    this.selectedProduct = product;
  }

  resetView() {
    this.selectedProduct = null;
  }

  addToCart() {
    if (this.isAuthenticated) {
      let info = { cartID: this.cartID, productID: this.selectedProduct.ID };
      console.log(info);

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

  private populateProducts() {
    this.service.getAllProducts()
      .subscribe(
        responseData => {
          this.products = responseData.body;
        }, error => {
          console.log(error);
        }
      )
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
