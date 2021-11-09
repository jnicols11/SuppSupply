import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../models/Product.model';
import { ProductService } from '../services/product.service';
import { UpdateCart } from '../store/actions/cart.actions';
import { AppState, selectCartState } from '../store/app.states';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  query: string;
  products: Product[] = [];
  selectedProduct: Product;
  cartState: Observable<any>;
  stateProducts: any = [];

  constructor(private route: ActivatedRoute, private store: Store<AppState>, private service: ProductService, private router: Router) {
    this.cartState = this.store.select(selectCartState);
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(
        params => {
          this.query = params['search_query'];
        }
    );

    this.populateProducts();
    this.setState();
  }

  selectProduct(product: Product) {
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
    this.service.searchForProducts(this.query)
      .subscribe(
        responseData => {
          for (const index in responseData.body) {
            let product = new Product(
              responseData.body[index]['ID'],
              responseData.body[index]['name'],
              responseData.body[index]['description'],
              responseData.body[index]['price'],
              responseData.body[index]['quantity'],
              responseData.body[index]['image']
            )

            this.products.push(product);
            console.log(this.products);
          }
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
