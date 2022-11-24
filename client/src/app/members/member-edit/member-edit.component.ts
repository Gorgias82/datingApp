import { ThrowStmt } from '@angular/compiler';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm : NgForm
  member: Member;
  user: User;

  //este se utiliza para controlar el evento del browser
  //en este caso cuando vaya a cambiar de pagina o cerrarla
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event : any){
    if(this.editForm.dirty){
      $event.returnValue = true;
    }
  }

  constructor(private accountService: AccountService, private memberService: MembersService, private toastr : ToastrService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    console.log(this.user)
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMember(this.user.userName).subscribe(member => {
      console.log(member);
      this.member = member;
    })
  }

  updateMember(){
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastr.success("Profile updated succesfully")
      this.editForm.reset(this.member);
    });
 
  }

}
