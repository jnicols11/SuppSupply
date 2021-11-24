import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  error: Subject<string>;
  regSuccess = false;
  regFailure = false;

  constructor(private userService: UserService, private cartService: CartService) { }

  ngOnInit(): void {
    this.initForm();
  }

  onRegister() {
    this.userService.register(this.registerForm.value)
      .subscribe(
        responseData => {
          let userID = responseData.body['ID'];
          this.cartService.createCart(userID)
            .subscribe(
              response => {
                console.log(response);
              }, error => {
                console.log(error);
              }
            )
          this.regSuccess = true;
        }, error => {
          this.regFailure = true
          this.regSuccess = false;
          this.error.next(error.message);
        }
      )
  }

  private initForm() {
    this.registerForm = new FormGroup({
      'firstName': new FormControl(null, Validators.required),
      'lastName': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    });
  }
}
