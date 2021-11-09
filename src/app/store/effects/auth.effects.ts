import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { tap } from 'rxjs/operators';

import { UserService } from '../../services/user.service';
import {
  AuthActionTypes,
  LogIn, LogInSuccess, LogInFailure
} from '../actions/user.actions';
import { CartService } from 'src/app/services/cart.service';


@Injectable()
export class AuthEffects {

  constructor(
    private actions: Actions,
    private userService: UserService,
    private cartService: CartService,
    private router: Router,
  ) {}

  // effects go here
  @Effect()
  LogIn: Observable<any> = this.actions
    .ofType(AuthActionTypes.LOGIN)
    .map((action: LogIn) => action.payload)
      .switchMap(payload => {
         return this.userService.login(payload.email, payload.password)
           .map((user) => {
              return new LogInSuccess({ ID: user.body.ID, firstName: user.body.FirstName, lastName: user.body.LastName, email: payload.email })
          }).catch(
          (error) => {
            console.log(error);
            return Observable.of(new LogInFailure({ error: error }));
          }
        );
  });

  @Effect({ dispatch: false })
  LogInSuccess: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_SUCCESS),
    tap((user) => {
      localStorage.setItem('token', user.payload.ID);
      this.cartService.setCart(user.payload.ID);
      this.router.navigate(['/']);
    })
  );

  @Effect({ dispatch: false })
  LogInFailure: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_FAILURE)
  );

  @Effect({ dispatch: false })
  public LogOut: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGOUT),
    tap((user) => {
      localStorage.removeItem('token');
    })
  );
}

