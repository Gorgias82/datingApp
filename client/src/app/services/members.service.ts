import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, pipe, scheduled } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination.model';
import { UserParams } from '../models/user-params.model';
import { AccountService } from './account.service';
import { take } from 'rxjs/operators';
import { User } from '../models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl : string = environment.apiUrl;
  members : Member[] = [];
  memberCache = new Map();
  user : User;
  userParams : UserParams;
  constructor(private http : HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(params : UserParams){
    this.userParams = params;
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams : UserParams) {
    //busca en el  mapa de caches las busquedas ya realizadas
    //filtradas por los userParams que recibe como argumento
    //y las añade en el mapa
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    console.log(response);
    //en caso de que ya haya alguna la devuelve como observable usando of
    if(response){
      return of(response);
    }


    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    //al poner el objeto con observe y los parametros ya no devuelve solo el body
    //si no toda la respuesta, incluidas cabeceras
    return getPaginatedResult(this.baseUrl + 'users', params, this.http)
      .pipe(map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response
      }))
  }

 

  getMember(username : string){
    console.log(username)
    //Primero transforma el map del memberCache
    //en una array de sus valores que seran los paginatedResults
    //les aplica reduce  con concat al previous value concatenando 
    //el result de cada elemento(que es el member)
    //lo que genera un array de todos los members de todas las consultas
    //que se han ido acumulando en la cache
    //a este array le aplica find para extraer el member con el username
    //que recibe como argumento
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member : Member) => member.username === username);

    //en caso de que ya haya algun miembro lo devuelve como observable usando of
    if(member){
       return of(member);    
    } 
    return this.http.get<Member>(this.baseUrl +  'users/' + username);
  }

  updateMember(member: Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId : number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId : number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username : string){
    return this.http.post(this.baseUrl + 'likes/' + username, {})
  }

  getLikes(predicate: string, pageNumber : number, pageSize : number){
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params, this.http);
  }
  
  
}
