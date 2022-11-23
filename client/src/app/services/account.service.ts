import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import {map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { PresenceService } from './presence.service';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl : string = environment.apiUrl;
  //replaysubject es un tipo de Observable
  //actua como un bufer guarda el ultimo tipo de valor
  //indicado al que haya habido una subscripcion
  //en este caso User y solo un valor
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ : Observable<User> = this.currentUserSource.asObservable();

  constructor(private http : HttpClient, private presenceService : PresenceService) { }

  login(model: any){
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response : User) => {
        const user = response;
        if(user){
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  register(model : any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user : User) => {
        if(user){
          this.setCurrentUser(user);  
        }
        return user;
      })
    )
  }

  setCurrentUser(user: User){
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);

    //esta parte es para la online presence
    this.presenceService.createHubConnection(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    
    //esta parte es para la online presence
    this.presenceService.stopHubConnection()
  }

  getDecodedToken(token){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
