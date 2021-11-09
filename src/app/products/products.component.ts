import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProductService } from '../services/product.service';
import { UpdateCart } from '../store/actions/cart.actions';
import { AppState, selectCartState } from '../store/app.states';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any = [];
  cartState: Observable<any>;
  selectedProduct = null;
  stateProducts: any = [];

  constructor(private service: ProductService, private store: Store<AppState>, private router: Router) {
    this.cartState = this.store.select(selectCartState);
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
    this.stateProducts.push(this.selectedProduct);

    this.store.dispatch(new UpdateCart({ products: this.stateProducts }));

    this.router.navigate(['/cart']);
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
      }
    )
  }
}
