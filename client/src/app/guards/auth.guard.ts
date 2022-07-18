import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})

//se suscribe automaticamente a todos los observables
//no hace falta inyectarlos
export class AuthGuard implements CanActivate {


  constructor(private accountService : AccountService, private toastr: ToastrService) {
    
  
  }
  canActivate() : Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map(user => {
        if(user){
          return true;
        }else{
          this.toastr.error('You shall not pass!');
        }
      })
    )
  }
  
}
