import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Group } from '../models/group.model';
import { Message } from '../models/message.model';
import { User } from '../models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection
  private messageThreadSource = new BehaviorSubject<Message[]>([])
  messageThread$ = this.messageThreadSource.asObservable()

  constructor(private http: HttpClient) { }

  createHubConnection(user: User, otherUsername: string){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token
    })
    .withAutomaticReconnect()
    .build()

    this.hubConnection.start().catch(error => console.log(error))

    this.hubConnection.on("ReceiveMessageThread", messages => {
      this.messageThreadSource.next(messages);
    })

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(x => x.username === otherUsername)){
        this.messageThread$.pipe(take(1)).subscribe({
          next: messages => {
            messages.forEach(message => {
              if(!message.dateRead){
                message.dateRead = new Date(Date.now())
              }
            })
            this.messageThreadSource.next([...messages]);
          }
        })
      }
    })

    //añade el mensaje del metodo de signalR al thread de messages
    //como usa el spread operator(los puntos suspensivos) crea un
    // array nuevo tomando como base el anterior y añadiendo el mensaje
    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe({
        next : messages => {
          this.messageThreadSource.next([...messages, message])
        }
      })
    } )
  }

  stopHubConnection(){
    if(this.hubConnection){
      this.hubConnection.stop()
    }   
  }

  getMessages(pageNumber, pageSize, container){
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);

    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
  }

  getMessageThread(username: string){
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  //el metodo invoke devuelve una promise
  //al hacer este metodo async nos garantizamos que la devuelva
  async sendMessage(username: string, content: string){
    //se usa recipientUsername como objeto al pasar datos porque el nombre es diferente
    //content como es el mismo nombre se pasa tal cual
    // return this.http.post<Message>(this.baseUrl + 'messages', {recipientUsername : username, content})

    //aqui se pasa el nombre del metodo de messageHub
    return this.hubConnection?.invoke('SendMessage', {recipientUsername : username, content})
      .catch(error => console.log(error))
  }

  deleteMessage(id: number){
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
