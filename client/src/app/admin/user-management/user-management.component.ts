import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  //no incluye todas las propiedades de los users por eso se usa Partial
  users : Partial<User[]>;
  bsModalRef : BsModalRef;

  constructor(private adminService : AdminService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(users => {
      this.users = users;
    })
  }

  openRolesModal(user : User) {
    const config = {
      class: 'modal-dialog.centered',
      initialState: {
        user,
        roles : this.getRolesArray(user)
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    //toma el event emitter del modal y filtra los valores que estan checked
    //extrayendo su name
    this.bsModalRef.content.updateSelectedRoles.subscribe(values => {
      const rolesToUpdate = {
        roles : [...values.filter(el => el.checked === true).map(el => el.name)]
      }
      //si hay alguno checkeado llama al service para hacer el update correspondiente
      if(rolesToUpdate) {
        this.adminService.updateUserRoles(user.username, rolesToUpdate.roles).subscribe(() => {
          user.roles = [...rolesToUpdate.roles]
        })
      }
    })


  }

  private getRolesArray(user : User){
    const roles = [];
    const userRoles = user.roles;
    const availableRoles : any[] = [
      {name: 'Admin', value: 'Admin'},
      {name: 'Moderator', value: 'Moderator'},
      {name: 'Member', value: 'Member'}
    ]
    //comprueba si el usuario tiene alguno de los roles
    //especificados y lo incluye en el array que devuelve
    //y si hace match es decir que el usuario tiene ese role
    //pone el checked en true y si no lo incluye igualmente pero
    // con el checked en false
    availableRoles.forEach(role => {
      let isMatch = false;
      for(const userRole of userRoles){
        if(role.name === userRole){
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if(!isMatch){
        role.checked = false;
        roles.push(role)
      }
    })
    return roles;
  }
}
