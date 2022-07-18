import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../services/account.service';
import {ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  //recibe variable del componenente  padre
  // @Input() usersFromHomeComponent : any;

  //Emite variable hacia el componente padre
  @Output() cancelRegister = new EventEmitter();
  model : any = {};
  constructor(private accountService : AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  register(){
    this.accountService.register(this.model).subscribe(response => {
      console.log(response);
      this.cancel();
    }, error => {
      console.log(error);
      this.toastr.error(error.error);
    })
  }
  cancel(){
    this.cancelRegister.emit(false);
  }
}
