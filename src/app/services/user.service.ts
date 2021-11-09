import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _authenticated = false;
  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  register(user: User) {
    // make call to API to register User
    return this.http.post(
      'http://localhost:3000/user/register',
      user,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  login(email: string, password: string): Observable<any> {
    // make call to API to login User
    return this.http.post(
      'http://localhost:3000/user/login',
      {email: email, password: password},
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }
}
