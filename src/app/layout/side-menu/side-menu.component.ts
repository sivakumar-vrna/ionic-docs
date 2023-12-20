import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@capacitor/storage';
import { MULTIUSER, MULTIUSER_IMG, MULTIUSER_NAME } from 'src/app/vrna/pages/switch-profiles/switch-profiles.component';
import {EventsService} from 'src/app/shared/services/events.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  name: string;
  username: string;
  userImage: any;
  multiUserImage: any;
  pId: any;
  multiUsername: any;

  uniquePageId:any;
  public menus = [
    { title: 'Home', url: '/home', icon: 'home-outline' },
    { title: 'Switch Profile', url: '/switch-profiles', icon:'people-outline' },
    { title: 'Featured', url: '/view-category/featured', icon: 'bookmark-outline' },
    { title: 'Rented', url: '/view-category/rented', icon: 'film-outline' },
    { title: 'Watchlist', url: '/view-category/watchlist', icon: 'play-circle-outline' },
    { title: 'Latest', url: '/view-category/latest', icon: 'cloud-done-outline' },
    { title: 'Trending', url: '/view-category/trending', icon: 'diamond-outline' },
    { title: 'Top Movies', url: '/view-category/top', icon: 'easel-outline' },
    { title: 'Recommended', url: '/view-category/recommended', icon: 'flag-outline' },
    { title: 'My Transactions', url: '/transactions', icon: 'card-outline' },
    { title: 'Support', url: '/support', icon: 'help-circle-outline' },
    { title: 'My Account', url:'/my-account', icon:'person-circle' }
  ];

  public menus_temp: any[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuControl: MenuController,
    private user: UserService,
    private chRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private eventsService: EventsService,
  ) { 
    this.menus_temp = JSON.parse(JSON.stringify(this.menus));

    //translating the mnu_*
      this.eventsService.subscribe('i18n:layout', (locale) => {       
        this.user.getTranslation(locale).then(data_i18n => {
          let json_data_i18n = JSON.parse(data_i18n);
          this.menus.map((menu, index) => {
            let str_menu_title: string = this.menus_temp[index].title.toLowerCase();
            str_menu_title = str_menu_title.split(' ').join('_');
            if(json_data_i18n['mnu_'+str_menu_title]){
              menu.title = json_data_i18n['mnu_'+str_menu_title];
            }else{
              menu.title = this.menus_temp[index].title;
            }
          });
        });
    });
  }

  keypressOnMnu(event: KeyboardEvent, mnuindex:any): void {    
    let elem: any;  
    if(event.key == 'ArrowDown'){
      event.stopPropagation();
      elem = document.getElementById('mnuindex-'+(mnuindex+1));
      if(!elem){
        elem = document.getElementById('mnuLogout');
      }
    }
    if(event.key == 'ArrowUp'){
      event.stopPropagation();
      elem = document.getElementById('mnuindex-'+(mnuindex-1));
      if(!elem){
        elem = document.getElementById('id_profile_mnu');
      }
    }
    if(event.key == 'ArrowLeft' || event.key == 'ArrowRight'){
      this.dismissSideMenu();
    }
        
    if(elem){
      elem.focus();
    }    
  }

  keypressOnOtherMnu(event: KeyboardEvent): void {
    if(event.key == 'ArrowLeft' || event.key == 'ArrowRight'){
      this.dismissSideMenu();
    }
    if(event.key == 'ArrowDown'){
      event.stopPropagation();
      
      //move dpad to home
      let elem = document.getElementById('mnuindex-0');
      if(elem){
        elem.focus();
      }
      event.preventDefault();
    }
  }

  keypressOnUpperMnu(event: KeyboardEvent): void {
    if(event.key == 'ArrowLeft' || event.key == 'ArrowRight'){
      this.dismissSideMenu();
    }    
    if(event.key == 'ArrowUp'){
      event.stopPropagation();
      event.preventDefault();
    }
  }

  async ngOnInit() {

    this.uniquePageId = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

    console.time('Perf: LayoutSideMenu Screen');    
    this.username = await this.user.getEmail();
    this.userImage = await this.user.getImage();
    this.name = this.username.substring(0, this.username.lastIndexOf("@"));
    if(this.userImage != 'null'){
      this.userImage = environment.cloudflareUrl+this.userImage;
    }else{
      if (localStorage.getItem('userImage')) {
        this.userImage = localStorage.getItem('userImage');
      } else {
        this.userImage = '/assets/images/profile-dummy.jpg';
      }
    }
    this.chRef.detectChanges();
    // this.multiUserImage = environment.cloudflareUrl+(localStorage.getItem('img'));
    // this.pId = localStorage.getItem('pId');
    // this.multiUsername = localStorage.getItem('name');
    const img = (await Storage.get({ key: MULTIUSER_IMG })).value;
    this.multiUserImage = environment.cloudflareUrl+img;
    this.pId = (await Storage.get({key: MULTIUSER})).value;
    this.multiUsername = (await Storage.get({key: MULTIUSER_NAME})).value;

    

  } 

 

  ngAfterViewInit() {
    console.timeEnd('Perf: LayoutSideMenu Screen');
  }

  async onLogout() {
    this.dismissSideMenu();
    await this.authService.logout();
    
  }

  dismissSideMenu() {
    this.menuControl.close();
    let menuBtnFocused = false;
    let elem: any;   

   elem = document.getElementById('btnMenu');
    if(!elem){
      elem = document.getElementById('btnMnu');
    }
    setTimeout(() => {
      const menuBtn = document.getElementById('btnMenu'); 
      const mnuBtn= document.getElementById('btnMnu');
      if (menuBtn) {
         menuBtn.focus();
         menuBtnFocused = true;
        }else if( mnuBtn){
        elem.focus();
        menuBtnFocused = true;

      }
      this.chRef.detectChanges();
    }, 800);

     setTimeout(() => {
      elem.focus();
      let elems = document.getElementsByClassName('mnuclass-for-dpad');

      for (var i=0; i < elems.length; i ++){
        let elem = elems[i] as HTMLElement;
        if(elem.offsetParent !== null){
          elem.focus();
        }
      }
      this.chRef.detectChanges();
    }, 500);

    // another way to focus to menu btn
    const menuBtn = document.getElementById('btnMenu') as HTMLElement;
    const mnuBtn = document.getElementById('btnMnu') as HTMLElement;
  
    const focusMenuButton = () => {
      if (menuBtn) {
        menuBtn.focus();
      } else if (mnuBtn) {
        mnuBtn.focus();
      }
    };
  
    setTimeout(focusMenuButton, 500);
  
    document.addEventListener('keydown', function checkFocus(event: KeyboardEvent) {
      if (event.key === 'BackButton' && document.activeElement !== menuBtn && document.activeElement !== mnuBtn) {
        setTimeout(focusMenuButton, 0);
      }
      document.removeEventListener('keydown', checkFocus);
    });
  
  }

  getImageUrl(path){
    return environment.cloudflareUrl+path;
  }
}
