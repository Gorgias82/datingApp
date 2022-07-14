import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import {map } from 'rxjs/operators';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl : string = 'https://localhost:5001/api/';
  //replaysubject es un tipo de Observable
  //actua como un bufer guarda el ultimo tipo de valor
  //indicado al que haya habido una subscripcion
  //en este caso User y solo un valor
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ : Observable<User> = this.currentUserSource.asObservable();

  constructor(private http : HttpClient) { }

  login(model: any){
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response : User) => {
        const user = response;
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
    );
  }

  register(model : any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user : User) => {
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
