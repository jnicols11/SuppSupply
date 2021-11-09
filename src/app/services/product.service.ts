import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseURL: string = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  getAllProducts() {
    return this.http.get(
      this.baseURL + '/products',
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  searchForProducts(name: string) {
    return this.http.get(
      this.baseURL + '/product/search/name/' + name,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }
}
