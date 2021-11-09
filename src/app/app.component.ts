import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UpdateCart } from './store/actions/cart.actions';

interface AppState {
  message: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  message: Observable<string>

  constructor(private store: Store<AppState>) {
    this.store.dispatch(new UpdateCart({ userID: null, products: [] }));
  }
}
