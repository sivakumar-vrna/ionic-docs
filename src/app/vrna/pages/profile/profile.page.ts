import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { IonAccordionGroup } from '@ionic/angular';
import {EventsService} from 'src/app/shared/services/events.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  activeTab: number = 1;
  personalData: any;
  profileInfoForm: FormGroup;
  userId: number;
  cardData: any;
  userImage: any;
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  public i18n_PageLabels = {
    profile_profile: 'Profile',
    profile_personal_details: 'Personal Details',
    profile_address: 'Address',
    profile_cards : 'Cards'
  }
  public i18n_PageLabels_temp: any;

  constructor(
    private profileService: ProfileService,
    private toast: ToastWidget,
    private userService: UserService,
    private chRef: ChangeDetectorRef,
    public eventsService: EventsService,
  ) { 
    this.i18n_PageLabels_temp = JSON.parse(JSON.stringify(this.i18n_PageLabels));

    //first time on page refresh // translate    
    this.eventsService.subscribe('i18n:layout', (locale) => {      
      this.userService.translateLayout(this.i18n_PageLabels, this.i18n_PageLabels_temp, 
        locale);      
    });
  }

  keypressOnProfileMenu(event: KeyboardEvent): void { 
    let elem:any;
    if (event.key == 'ArrowLeft'){
      elem=document.getElementById('btnBackProfile');
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }

  keypressOnPersonalTab(event: KeyboardEvent): void {  
    if(event.key == 'Enter'){
      event.stopPropagation();
      let elem = document.getElementById('tabPersonalDet');      
      elem.focus();
      
    }  
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      let elem = document.getElementById('input_firstName');
      if(!elem){
        elem = document.getElementById('btnChangePhoto')
      }
      elem.focus();
      event.preventDefault();
      this.chRef.detectChanges();
    }

    if(event.key == 'ArrowDown'){
      event.stopPropagation();
      let elem = document.getElementById('tabAddress');      
      elem.focus();
      this.chRef.detectChanges();
    }
    if(event.key == 'ArrowUp'){
      event.stopPropagation();
      let elem = document.getElementById('btnBackProfile');      
      elem.focus();
      this.chRef.detectChanges();
    }
  }

  keypressOnAddressTab(event: KeyboardEvent): void {
    let elem: any;
    if(event.key == 'Enter'){
      event.stopPropagation();
      let elem = document.getElementById('tabAddress');      
      elem.focus();
    }  
    if(event.key == 'ArrowRight'){
      elem = document.getElementById('btnEditAddress');      
      if(!elem){
        elem = document.getElementById('btnSaveAddress');        
      }
    }
    if(event.key == 'ArrowDown'){
      /*
      elem = document.getElementById('btnSaveAddress');
      if(!elem){
        elem = document.getElementById('btnEditAddress');      
      }
      if(!elem){
        elem = document.getElementById('tabCards');  
      }
      */

      elem = document.getElementById('tabCards');
      if(elem){
        event.stopPropagation();
        elem.focus();
        this.chRef.detectChanges();
      }

    }
    if(event.key == 'ArrowUp'){
      elem = document.getElementById('tabPersonalDet');      
    }

    if(elem){
      event.stopPropagation();
      elem.focus();
      this.chRef.detectChanges();
    }
  }

  keypressOnCardsTab(event: KeyboardEvent): void {
    let elem: any;  
    if(event.key == 'Enter'){
      event.stopPropagation();
      let elem = document.getElementById('tabCards');      
      elem.focus();
    }  
    if(event.key == 'ArrowUp'){
      elem = document.getElementById('tabAddress');      
    }
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('btnAddCard');      
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }

  async ngOnInit() {
    console.time('Perf: Profile Screen');
    this.userId = await this.userService.getUserId();
    await this.getProfileData();    
  }

  ngAfterViewInit() {
    setTimeout(() => {
      let elem = document.getElementById('tabPersonalDet');      
      if(elem){
        elem.focus();
      }
    }, 1000);

    //translate static labels // on page loads
    let user_locale = environment.user_locale;  
    this.userService.translateLayout(this.i18n_PageLabels, this.i18n_PageLabels_temp, 
      user_locale);


    console.timeEnd('Perf: Profile Screen');
  }

  async getProfileData() {
    (await this.profileService.getProfile()).subscribe(async (res) => {
      if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
        this.personalData = res.data.user_info;
        this.cardData = res.data.card_info;
      } else {
        // await this.toast.onFail('Error in the request');
      }
      this.chRef.detectChanges();
    }, (err: any) => {
      // this.toast.onFail('Network Error');
    });
  }

  onSelection(n) {
    this.activeTab = n;
    this.chRef.detectChanges();
  }

  onDeviceSelection(n) {
    if (this.activeTab === n) {
      this.activeTab = 0;
    } else {
      this.activeTab = n;
    }
    this.chRef.detectChanges();
  }

  onRefresh(event) {
    this.getProfileData();
    setTimeout(() => {
      event.target.complete();
      this.chRef.detectChanges();
    }, 2000);
  }

}
