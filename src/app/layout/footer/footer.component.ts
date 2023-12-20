import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { domain } from 'process';
import { HomeService } from 'src/app/vrna/pages/home/home.service';
import { environment } from 'src/environments/environment';
import {EventsService} from 'src/app/shared/services/events.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})

export class FooterComponent implements OnInit {
  favouritesDataSource: any;
  date = Date();

  public menus = [
    { title: 'Home', url: '/home' },
    //{ title: 'Categories',url:''}, // sitemap and category links should be enabled later
    { title: 'Featured', url: '/view-category/featured' },
    { title: 'Latest Movies', url: '/view-category/latest'},
    { title: 'Trending Movies', url: '/view-category/trending'},
  ];

  public footer_links = [
    { title: 'Privacy Policy'},
    { title: 'Terms of use'},    
  ];

  public FooterPageLabels = {
    copyright: '[COPYRIGHT NOTICE]',
    footer_site_maintained: '[SITE MAINTAINED BY]',
    footer_site_last_update: 'Site Last Updated',    
  }
  public FooterPageLabels_temp: any;
  public menus_temp: any[];
  public footer_links_temp: any[];

  public locales = [
    { title: 'English', code: 'en' },
    { title: 'தமிழ்', code: 'ta' },
    { title: 'తెలుగు', code: 'te'},
  ];  

  constructor(
    public router: Router,
    private menuControl: MenuController,
    private homeService: HomeService,
    private eventsService: EventsService,
    private userService: UserService

    ) {
      this.menus_temp = JSON.parse(JSON.stringify(this.menus));
      this.footer_links_temp = JSON.parse(JSON.stringify(this.footer_links));
    }

    keypressOnfooter(event:KeyboardEvent):void{
     let elem:any;
      if(event.key == 'ArrowRight'){
      let idElemActive = document.activeElement.getAttribute('id');
      let elemPart = idElemActive.split('-');
      let idActiveIndex = parseInt(elemPart[1]);

      let numLastCard = this.menus.length-1;

      if(numLastCard == idActiveIndex){
         elem = document.getElementById('redbox_1');
      }
      if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }

    }
    if(event.key == 'ArrowLeft'){
        let idElemActive = document.activeElement.getAttribute('id');
        let elemPart = idElemActive.split('-');
        let idActiveIndex = parseInt(elemPart[1]);
  
        if( idActiveIndex ==  0){
          event.stopPropagation();
          event.preventDefault();
        }
      } 
      if(event.key == 'ArrowUp'){
        elem = document.getElementById('featured_cast_carouselSwiper');
        if(elem){
          event.stopPropagation();
          elem.focus();
          event.preventDefault();
        }            
      }

    }
   
    keypressOnCnt_1(event: KeyboardEvent): void {
      if (event.key == 'ArrowLeft') {
        const lastMenu = this.menus.length - 1;
        
        if (lastMenu >= 0) {
          const lastMenuId = `footer_Mnu-${lastMenu}`;
          const elem = document.getElementById(lastMenuId);
          
          if (elem) {
            event.stopPropagation();
            elem.focus();
            event.preventDefault();
          }
        }
      }
    }
    
    keypressOnCnt_2(event:KeyboardEvent):void{
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        event.preventDefault();
       } 
    }

    keypressOnFooterFb(event:KeyboardEvent):void{
    
     if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();
     }   
    }
    keypressOnFooterlinkedin(event:KeyboardEvent):void{
    
      if(event.key == 'ArrowRight'){
       event.stopPropagation();
       event.preventDefault();
      }   
     }

  ngOnInit() {

    //translating the mnu_*
    this.eventsService.subscribe('i18n:layout', (locale) => {  
      this.userService.getTranslation(locale).then(data_i18n => {
        let json_data_i18n = JSON.parse(data_i18n);

        this.menus.map((menu, index) => {
          let str_menu_title: string = this.menus_temp[index]['title'].toLowerCase();
          str_menu_title = str_menu_title.split(' ').join('_');
          if(json_data_i18n['footer_'+str_menu_title]){
            menu.title = json_data_i18n['footer_'+str_menu_title];            
          }else{ // if no i18n avail; then show english
            menu.title = this.menus_temp[index]['title'];
          }
        });

        //for footer_links
        this.footer_links.map((menu, index) => {
          let str_menu_title: string = this.footer_links_temp[index]['title'].toLowerCase();
          str_menu_title = str_menu_title.split(' ').join('_');
          if(json_data_i18n['footer_'+str_menu_title]){
            menu.title = json_data_i18n['footer_'+str_menu_title];            
          }else{ // if no i18n avail; then show english
            menu.title = this.footer_links_temp[index]['title'];
          }
        });

        //translate static labels // on page loads       
        this.userService.translateLayout(this.FooterPageLabels, this.FooterPageLabels_temp, 
        locale);
        
      });
    });

    this.getFavouritesData();
    this.updateLastUpdatedDate();
  }

  switchLocale(locale: any){
    Storage.set({ key: 'user_locale', value: locale.code });
    environment.user_locale = locale.code;
    this.userService.syncStaticTranslation(locale.code);
  }  

  navigate() {
    this.router.navigate(['/terms']);
  }

  scrollToTopOfPage() {
    const element = document.getElementById('banner-section');

    // Scroll to the banner section
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      const firstElem = document.getElementById('bannerMain');
      if(firstElem){
        firstElem.focus();
      }      
    }, 1000);
  }
  
  getFavouritesData() {
    this.homeService.favouritesData.subscribe((data) => {
      if (data !== null) {
        this.favouritesDataSource = data;
      } else {
        this.favouritesDataSource = null;
      }
    });
  }

  updateLastUpdatedDate() {

    /*

    const currentDate = new Date();
    const formattedDate = `${(currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate()}/${
      ((currentDate.getMonth() + 1) < 10 ? '0' : '') + (currentDate.getMonth() + 1)}/${
      currentDate.getFullYear()}`;

    */

    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
      lastUpdatedElement.textContent = `[${environment.timeStamp} - ${environment.name.toUpperCase()}]`;
    }

    

    
  }


}
