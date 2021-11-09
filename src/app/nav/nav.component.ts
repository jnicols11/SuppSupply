import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../models/User.model';
import { Refresh } from '../store/actions/cart.actions';
import { LogOut } from '../store/actions/user.actions';
import { AppState, selectAuthState } from '../store/app.states';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  faSearch = faSearch;
  faShoppingCart = faShoppingCart;
  searchForm: FormGroup;
  getState: Observable<any>;
  isAuthenticated: false;
  user = null;
  errorMessage = null;

  constructor(private store: Store<AppState>, private router: Router,) {
    this.getState = this.store.select(selectAuthState);
   }

  ngOnInit(): void {
    this.initSearchBar();
    this.getState.subscribe((state) => {
      this.isAuthenticated = state.isAuthenticated;
      this.user = state.user;
      this.errorMessage = state.errorMessage;
    })
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  onSearch() {
    this.router.navigate(['/search'], { queryParams: this.searchForm.value });
  }

  logout() {
    this.store.dispatch(new LogOut);
    this.store.dispatch(new Refresh);
    this.router.navigate(['/']);
  }

  private initSearchBar() {
    this.searchForm = new FormGroup({
      'search_query': new FormControl(null, Validators.required)
    });
  }

}
