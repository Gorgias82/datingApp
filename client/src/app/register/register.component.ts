import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../services/account.service';
import {ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  registerForm : FormGroup;
  maxDate: Date = new Date;
  validationErrors: string[] = [];
  constructor(private accountService : AccountService, private toastr: ToastrService, private fb : FormBuilder, private router : Router) { }

  ngOnInit(): void {
  this.initializeForm();
  this.maxDate.setFullYear(this.maxDate.getFullYear() -18);
  console.log(this.maxDate);
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender : ['male'],
      username : ['',Validators.required],
      knownAs : ['',Validators.required],
      dateOfBirth : ['',Validators.required],
      city : ['',Validators.required],
      country : ['',Validators.required],
      password : ['', [Validators.required, Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    })
    //esto hace que si se modifica el password haga la comprobacion en el confirmar password
    //esto es por si se modifica el password y el formulario ya era valido
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  matchValues(matchTo: string): ValidatorFn{
    //compara el valor que se le pasa con el del propio formcontrol
    return( control : AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value 
      ?   null : {isMatching: true} 
    }
  }

  register(){
    this.accountService.register(this.registerForm.value).subscribe(response => {
      this.router.navigateByUrl('/members');
    }, error => {
      this.validationErrors = error;
      
    })
  }
  cancel(){
    this.cancelRegister.emit(false);
  }
}
