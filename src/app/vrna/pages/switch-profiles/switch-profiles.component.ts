import { Component, OnInit,AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SwitchProfilesService } from './switch-profiles.service';
import { Storage } from '@capacitor/storage';
import { ModalController } from '@ionic/angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
export const MULTIUSER = 'multiuser';
export const MULTIUSER_IMG = 'multiuser_img';
export const MULTIUSER_NAME = 'multiuser_name';
@Component({
  selector: 'app-switch-profiles',
  templateUrl: './switch-profiles.component.html',
  styleUrls: ['./switch-profiles.component.scss'],
})

export class SwitchProfilesComponent implements OnInit,AfterViewInit {
  itemList : any;
  primary_name: any;
  totalItems = 4;
  userImage: SafeUrl;
  showDeleteIcon: boolean = false;
  constructor(
    private router: Router,    
    public modalController: ModalController,
    private switchProfile: SwitchProfilesService,
    private sanitizer: DomSanitizer,
    private chref: ChangeDetectorRef
  ) { }

  keypressOnItem(event:KeyboardEvent,icon_index:number):void{
    if (event.key === 'ArrowUp' ) {
      event.stopPropagation();
      event.preventDefault();
      }

      if (event.key === 'ArrowLeft' && icon_index === 0) {
        const elem = document.getElementById('user-img');
          if(elem){
            event.stopPropagation();
            elem.focus()
            event.preventDefault();
          }
      }
      if(event.key == 'ArrowDown'){
        const elem =  document.getElementById('managebtn');
        if(elem){
          event.stopPropagation();
          elem.focus();
          event.preventDefault();
        }
      }

      if (event.key === 'ArrowRight' && icon_index === this.itemList.length - 1) {
        const firstAddItem = document.getElementById('addprofileopt-0') as HTMLButtonElement;
        if (firstAddItem) {
          event.stopPropagation();
          firstAddItem.focus();
          event.preventDefault();
        }
        if(!firstAddItem){
        event.stopPropagation();
        event.preventDefault();
        }
      }
     
  }

  keypressOndeletedIcon(event:KeyboardEvent,icon_index:number):void{
    if (event.key === 'ArrowUp' ) {
      event.stopPropagation();
      event.preventDefault();
      }
      if (event.key === 'ArrowLeft' && icon_index == 0) {
        event.stopPropagation();
        event.preventDefault();
      }
      if (event.key === 'ArrowRight' && icon_index == this.itemList.length - 1) {
        event.stopPropagation();
        event.preventDefault();
      }
      if(event.key == 'Enter'){
         let elem : any;
          elem = document.getElementById('itemlist');
          if(elem){
            event.stopPropagation();
            elem.click();
            event.preventDefault();
          }
      }
     
    }

    keypressOnManageBtn(event:KeyboardEvent):void{
    if(event.key == 'ArrowDown'){
      event.stopPropagation();
      event.preventDefault();
    }

    if (event.key == 'ArrowUp' ) {
      const elem = document.getElementById('user-img');
       if(!elem){
        let elem = document.getElementById('itemlist-0');
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
       }
        if (elem) {
          event.stopPropagation();
          elem.focus();
          event.preventDefault();
        }
      }
      if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        event.preventDefault();
      }
      if(event.key === 'ArrowRight'){
        event.stopPropagation();
        event.preventDefault();
      }
      if (event.key === 'ArrowUp' || event.key == 'ArrowRight' || event.key == 'ArrowLeft'&& this.showDeleteIcon) {
      const deleteIcon = document.querySelector('.delete-profile.arrow-navigable') as HTMLInputElement;
      if (deleteIcon) {
        event.stopPropagation();
        deleteIcon.focus();
        event.preventDefault();
       } 
      }
    }
    keypressOnUserimg(event:KeyboardEvent):void{
      if (event.key === 'ArrowRight' && this.showDeleteIcon) {
        let deleteIcon = document.querySelector('addprofileopt-0') as HTMLInputElement;
         if(!deleteIcon){
          event.stopPropagation();
          event.preventDefault();
         }
        if (deleteIcon) {
          event.stopPropagation();
          deleteIcon.focus();
          event.preventDefault();
         }
          
        }
        if(event.key == 'ArrowLeft'){
          event.stopPropagation();
          event.preventDefault();
        }
        if(event.key == 'ArrowUp'){
          event.stopPropagation();
          event.preventDefault();
        }
        if(event.key == 'ArrowDown'){
          const elem = document.getElementById('managebtn');
          if(elem){
            event.stopPropagation();
            elem.focus()
            event.preventDefault();
          }
        }
       
    }
    keypressOnAddIconbtn(event: KeyboardEvent, Add_icon_index: number): void {
      if (event.key === 'ArrowLeft' && Add_icon_index == 0) {
        const elem = document.getElementById('itemlist-0');
        if (elem) {
          event.stopPropagation();
          elem.focus();
          event.preventDefault();
        }
      } else if (event.key === 'ArrowRight') {
        let str_activeElemId = document.activeElement.getAttribute('id');
        let elemParts = str_activeElemId.split('-');
        let activeElemId = parseInt(elemParts[1]);
        let addPlusElem = document.getElementById('addprofileopt-'+(activeElemId+1));

        if(!addPlusElem){
          event.stopPropagation();
          event.preventDefault();
          this.chref.detectChanges();
        }
        
      } else if (event.key === 'ArrowUp') {
        event.stopPropagation();
        event.preventDefault();
      } else if (event.key === 'ArrowDown') {
        const elem = document.getElementById('managebtn');
        if (elem) {
          event.stopPropagation();
          elem.focus();
          event.preventDefault();
        }
      }
    }
    
    
    
    async ngOnInit() {


    // this.route_to_home();
    // this.add_profile();
    this.userImage = localStorage.getItem('IMAGE_KEY');
    if(this.userImage != 'null'){
      this.userImage = environment.cloudflareUrl+this.userImage;
    }else{
      if (localStorage.getItem('userImage')) {
        this.userImage = this.sanitizer.bypassSecurityTrustResourceUrl(localStorage.getItem('userImage'));
      } else {
        this.userImage = 'assets/images/profile-dummy.jpg';
      }
    }
    this.primary_name = localStorage.getItem('USERNAME_KEY');
    this.fetchProfile();
    
  }

    ngAfterViewInit(){
      this.chref.detectChanges(); 

      setTimeout(() => {
          let elem = document.getElementById('managebtn');
          if(elem){
            elem.focus();
          }
        },600);
      }
  def_route_to_home(){
    localStorage.setItem('pId','false')
    Storage.set({ key: MULTIUSER, value: 'false' });
    this.router.navigateByUrl('/home');
    setTimeout(function(){
      (window as any).location.reload();
    },1000);  
  }
  route_to_home(img,name){
    localStorage.setItem('pId','true')
    localStorage.setItem('img',img)
    localStorage.setItem('name',name)
    Storage.set({ key: MULTIUSER, value: 'true' });
    Storage.set({ key: MULTIUSER_IMG, value: img });
    Storage.set({ key: MULTIUSER_NAME, value: name });
    this.router.navigateByUrl('/home');
    setTimeout(function(){
      (window as any).location.reload();
    },1000);    
  }

  add_profile(){
    this.router.navigateByUrl('/add-profile');    
    setTimeout(function(){
      (window as any).location.reload();
    },1000);        
  }

  getImageUrl(path){
    return environment.cloudflareUrl+path;
  }

  async fetchProfile() {
    (await this.switchProfile.getProfiles()).subscribe(
      (res) => {
        this.itemList = res.data;

        setTimeout(() => {
          const elem = document.getElementById('managebtn');
          if(elem){
            elem.focus();
          }
        },300);
        // console.log('GET SWITCH PROFILES',res?.data);
      },
      (err) => {
        alert(err);
      }
    );
  }

  addItems() {
    const existingIndices = this.itemList.map((i,index) => index);
    const allIndices = Array.from({ length: this.totalItems }, (_, index) => index);
    const nonExistingIndices = allIndices.filter(index => !existingIndices.includes(index));
    return nonExistingIndices;
  }

  async deleteProfile(e) {
    (await this.switchProfile.removeProfile(e)).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          this.fetchProfile();
        }
      },
      (err) => {
      }
    );
  }
}
