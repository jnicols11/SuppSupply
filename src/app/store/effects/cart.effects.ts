import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable } from "rxjs";
import { CartService } from "src/app/services/cart.service";
import { CartActionTypes } from "../actions/cart.actions";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { tap } from 'rxjs/operators';

@Injectable()
export class CartEffects {

  constructor(
    private actions: Actions,
    private cartService: CartService,
    private router: Router
  ) { }

  // Effects Go Here
  @Effect()
  UpdateCart: Observable<any> = this.actions.pipe(
    ofType(CartActionTypes.UPDATECART),
    tap((cart) => {
      localStorage.setItem('cartID', cart.payload.userID);
    })
  )

  @Effect({ dispatch: false })
  public Refresh: Observable<any> = this.actions.pipe(
    ofType(CartActionTypes.REFRESH),
    tap((cart) => {
      localStorage.removeItem('cartID');
    })
  );
}
