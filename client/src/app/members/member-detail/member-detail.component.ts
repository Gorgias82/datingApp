import { createViewChild } from '@angular/compiler/src/core';
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryImage, NgxGalleryOptions, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { MessageService } from 'src/app/services/message.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  //static true es la version reactiva de viewchild reacciona a cambios en el componente
  @ViewChild('memberTabs', {static : true}) memberTabs : TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab : TabDirective;
  messages : Message[] = [];
  user?: User

  constructor(private membersService : MembersService, private route : ActivatedRoute,
     private messageService : MessageService, public presenceService : PresenceService,
     private accountService : AccountService, private router : Router) {
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next : user => {
            if(user){
              this.user = user
            }
        }
      })
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  

  ngOnInit(): void {
    // this.loadMember();
    this.route.data.subscribe(data => {
      this.member = data.member;
    })

    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })

    this.galleryOptions = [
      {
        width : '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]
    
    this.galleryImages = this.getImages();
  }

  ngOnDestroy(): void {
    
    this.messageService.stopHubConnection()
  }

  getImages(): NgxGalleryImage[]{
    const imageUrls = [];
    for (const photo of this.member.photos){
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imageUrls;
  }

  loadMember(){
    //toma el username usando snapshot y paramMap con get( lo toma de la ruta desde donde
    //se ha clickado a este componente, es decir del member card)
    this.membersService.getMember(this.route.snapshot.paramMap.get('username')).subscribe(member => {
      this.member = member;
      
    })
  }

  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    })
  }

  selectTab(tabId : number){
    this.memberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data : TabDirective){
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.user) {
      this.messageService.createHubConnection(this.user, this.member.username);
    }else{
      this.messageService.stopHubConnection()
    }
  }
}
