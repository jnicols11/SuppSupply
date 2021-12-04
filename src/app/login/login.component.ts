import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../models/User.model';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { LogIn } from '../store/actions/user.actions';
import { AppState, selectAuthState, selectCartState } from '../store/app.states';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  getState: Observable<any>;
  user: User;
  errorMessage: string | null;
  cartProducts: any = [];
  cartID: number;
  checkout: boolean = false;

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private router: Router,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {
    this.getState = this.store.select(selectAuthState);
   }

  ngOnInit(): void {
    this.initForm();
    this.checkErrors();
    this.route.queryParams
      .subscribe(
        params => {
          if (params.action == 'checkout') {
            this.checkout = true;
          }
        }
      )
  }

  onLogin() {
    const payload = this.loginForm.value;
    payload.checkout = this.checkout;

    this.store.dispatch(new LogIn(payload));
  }

  private initForm() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    })
  }

  private checkErrors() {
    this.getState.subscribe((state) => {
      this.errorMessage = state.errorMessage;
    })
  }
}
