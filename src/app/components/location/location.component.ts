import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { ModalController, IonSearchbar } from '@ionic/angular';
import { HomeService } from 'src/app/vrna/pages/home/home.service';
import { COUNTRIES_KEY, COUNTRY_KEY, CURRENCY_KEY } from 'src/app/vrna/services/ui-orchestration/orch.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { UserService } from 'src/app/shared/services/user.service';
import videojs from 'video.js';
import { environment } from 'src/environments/environment';
import { FIRSTLOGIN_KEY } from 'src/app/shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  userId: number;
  countries: any[] = [];
  location: string = '';
  currency: string = '';
  searchText: string = '';
  selectedCountryName: string = ''; 
  cntry: string = '';
  isDisabled: boolean = true;
  isManualLocPopTrigger: boolean = false;

  @ViewChild('countrySearchInput', {static: false}) countrySearchInput: IonSearchbar;

  constructor(
    public modalController: ModalController,
    public homeService: HomeService,
    private profileService: ProfileService,
    private toast: ToastWidget ,
    private userService: UserService,
    private chRef: ChangeDetectorRef,
    private router: Router,
  ) { }

  keypressOnInputBox(event: KeyboardEvent): void {    
    if(event.key == 'ArrowRight' || event.key == 'ArrowDown' || event.key == 'Enter'){
      event.stopPropagation();
      const elem = document.getElementById('opt_country_0');
      elem.focus();
      event.preventDefault();          
    }
    if(event.key == 'ArrowLeft' || event.key == 'ArrowUp'){
      event.stopPropagation();      
      event.preventDefault();          
    }
  }

  keypressOnRadioGroup(event: KeyboardEvent): void {    
    if(event.key == 'Enter' || event.key == 'ArrowRight'){
      event.stopPropagation();
      const elem = document.getElementById('btnOk');
      elem.focus();
      event.preventDefault();      
    }
    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      this.countrySearchInput.setFocus();      
      event.preventDefault(); 
    }    
  }
  async ngOnInit() {
    console.time('Perf: CompnLocation Screen');
    //this.location = (await Storage.get({ key: COUNTRY_KEY })).value;
    //this.cntry = (await Storage.get({ key: COUNTRY_KEY }))?.value;
    // alert(this.location);
    try {
      /*
      const countriesDataString = (await Storage.get({ key: COUNTRIES_KEY }))?.value;
      const countriesData = JSON.parse(countriesDataString);
  
      const selectedCountry = countriesData.find((country) => country.countryCode === this.location);
      if (selectedCountry) {
        this.selectedCountryName = selectedCountry.country_name;
      } else {
        this.selectedCountryName = '';
      }
      */
      
      // Pause video players
      try{
        const players = videojs.getAllPlayers();
        players.forEach(function (player) {
          if (!player.paused()) {
            player.pause();
          }
        });
        this.chRef.detectChanges();
      }catch(err){
        console.log(err);
      }
  
    } catch (error) {
      console.error('Error:', error);
    }
  }  

  async ngAfterViewInit() {

    this.countries = JSON.parse((await Storage.get({ key: COUNTRIES_KEY }))?.value);
    this.location = (await Storage.get({ key: COUNTRY_KEY })).value;
    this.userId = await this.userService.getUserId();   


    //if null, set user_browser_country
    if(this.location == null || this.location == 'null'){
      const user_browser_country = (await Storage.get({ key: 'user_browser_country' })).value;
      if(user_browser_country != null){
        Storage.set({ key: COUNTRY_KEY, value: user_browser_country });
      }
    }

    console.log('country after first view init:', this.location);

    if(this.countries == null){
      this.countries = JSON.parse(environment.json_countries);
    }

    const selectedCountry = this.countries.find((country) => country.countryCode === this.location);
    if (selectedCountry) {
      this.selectedCountryName = selectedCountry.country_name;
    } else {
      this.selectedCountryName = '';
    }

    setTimeout(() => { 
      this.countrySearchInput.setFocus();
      this.refreshCountry();
      this.chRef.detectChanges();
    }, 1500);
    console.timeEnd('Perf: CompnLocation Screen');
  }

  async refreshCountry(){
    this.location = (await Storage.get({ key: COUNTRY_KEY })).value;

    if(this.countries == null){
      this.countries = JSON.parse(environment.json_countries);
    }

    const selectedCountry = this.countries.find((country) => country.countryCode === this.location);
    if (selectedCountry) {
      this.selectedCountryName = selectedCountry.country_name;
    } else {
      this.selectedCountryName = '';
    }

    //if location pop got automatically opened but there is a country is set; 
    //then close it.    
    if(!this.isManualLocPopTrigger && this.selectedCountryName != '' ){
      this.dismiss();

      //after closing the window; set focus to:
      //+ manage profiles (or)
      //+ home page banner (or)
      //+ hamburger menu
      let elem: any;
      elem = document.getElementById('managebtn');
      if(!elem){
        elem = document.getElementById('bannerMain');
      }
      if(!elem){
        elem = document.getElementById('btnMnu');
      }

      if(elem){
        elem.focus();
      }else{
        (window as any).focus();
      }

      this.chRef.detectChanges();
    }

  }

  ionViewDidEnter() {
    setTimeout(() => { 
      this.countrySearchInput.setFocus(); 
      this.chRef.detectChanges();
    }, 1000);
  }

  onLocation(countryCode: string, currency: string) {
    this.location = countryCode;
    this.currency = currency;
    this.chRef.detectChanges();
  }

  onUserInput(event:any){
    let input = event.target.value;
    if(!input){
      this.isDisabled = true;
    }
    else{
      this.isDisabled = false;
    }
  }
  
 async onSubmit() {
    Storage.set({ key: COUNTRY_KEY, value: this.location });
    Storage.set({ key: CURRENCY_KEY, value: this.currency });
     
      const data = {
        userId: this.userId,
        country: this.location, 
        };
      (await this.profileService.updateProfile(data)).subscribe(
        (res: any) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          } else {
            // this.toast.onFail('Error updating location');
          }
        },
        (err: any) => {
          // this.toast.onFail('Network Error');
        }
      );
    this.dismiss();
    
    //await this.homeService.getAllHomeData();
    //this.router.navigate(['/home']);
    (window as any).location.reload();
  }


  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });    

    let elem: any;
    elem = document.getElementById('managebtn');
    if(!elem){
      elem = document.getElementById('bannerMain');
    }
    if(!elem){
      elem = document.getElementById('btnMnu');
    }

    if(elem){
      elem.focus();
    }else{
      (window as any).focus();
    }

    this.chRef.detectChanges();
  }

  onSearchCountry(e: any) {
    const query = e.target.value.toLowerCase();
    this.searchText = query;
    this.chRef.detectChanges();
  }
}
