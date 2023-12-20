import { Component, OnInit, ChangeDetectorRef,AfterViewInit, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';
import { MULTIUSER, MULTIUSER_IMG, MULTIUSER_NAME } from 'src/app/vrna/pages/switch-profiles/switch-profiles.component';
import { Storage } from '@capacitor/storage';
import { Router} from '@angular/router';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { AllActorsService } from './all-actors/all-actors.service';
import { FavoriteMoviesService } from './favorite-movies/favorite-movies.service';
import { AllMoviesService } from './all-movies/all-movies.service';
import { ActorPageService } from './actor-page/actor-page.service';

@Component({
  selector: 'app-actor-page-tv',
  templateUrl: './actor-page-tv.component.html',
  styleUrls: ['./actor-page-tv.component.scss'],
})
export class ActorPageTvComponent  implements OnInit,AfterViewInit {
  name: string;
  username: string;
  userImage: any;
  multiUserImage: any;
  pId: any;
  multiUsername: any;
  menuActive: number = 0;
  menus = [
    {
      id: 1,
      // link: '/actor-page-tv/actor-pages',
    },
    {
      id: 2,
      link: '/actor-page-tv/all-movies',
    },
    {
      id: 3,
      link: '/actor-page-tv/favorite-movies',
    },
    {
      id:4,
      link:'/actor-page-tv/all-actors',
    },
    {
      id:5,
      link:'/actor-page-tv/search-tv',
    },
    {
      id:6,
      link:'/actor-page-tv/setting-tv',
    }
    ]

  constructor(
    private user: UserService,
    private chRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private router: Router,
    private modalController: ModalController,
    private allActorsService: AllActorsService,
    private favMoviesService:FavoriteMoviesService,
    private allMovieservice:AllMoviesService,
    private actorService:ActorPageService
    ) {}


    KeypressOnsidebar(event:KeyboardEvent):void{
      if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        event.preventDefault();
       }
    }

    KeypressOnAllAvatar(event:KeyboardEvent):void{
      let elem:any;

      if(event.key == 'ArrowRight'){
        // elem = document.getElementById('All-movies-search'); 
        event.stopPropagation();
        event.preventDefault();
      }    
      if(!elem){
        event.stopPropagation();
        event.preventDefault();
      }
      if(event.key == 'Enter'){
        elem = document.getElementById('avatar-img');
        elem.click();
      }
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        event.preventDefault();
      }
      if(event.key == 'ArrowDown'){
        elem =  document.getElementById('search-icon');
      }

       if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }  
    }
    KeypressOnAllSearch(event:KeyboardEvent):void{
      let elem:any;

      if(event.key == 'ArrowRight'){
        // elem = document.getElementById('All-movies-search'); 
        event.stopPropagation();
        event.preventDefault();
      }    
      if(!elem){
        event.stopPropagation();
        event.preventDefault();
      }
      if(event.key == 'Enter'){
        elem = document.getElementById('search-icon');
        elem.click();
      }
      if(event.key == 'ArrowUp'){
        elem = document.getElementById('avatar-img');
      }
      if(event.key == 'ArrowDown'){
        elem =  document.getElementById('home_icon');
      }

       if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }     
    }

    KeypressOnHome(event:KeyboardEvent):void{
      let elem:any;

      if(event.key == 'ArrowRight'){
        // elem = document.getElementById('All-movies-search'); 
        event.stopPropagation();
        event.preventDefault();
      }    
      if(!elem){
        event.stopPropagation();
        event.preventDefault();
      }
      if(event.key == 'Enter'){
        elem = document.getElementById('home_icon');
        elem.click();
      }
      if(event.key == 'ArrowUp'){
        elem = document.getElementById('search-icon');
      }
      if(event.key == 'ArrowDown'){
        elem =  document.getElementById('All_movies');
      }

       if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }     
    }

    KeypressOnAllMovies(event:KeyboardEvent):void{
      let elem:any;
      if(event.key == 'ArrowRight'){
        this.allMovieservice.setFocusOnSearchbar();
      }    
      if(!elem){
        event.stopPropagation();
        event.preventDefault();
      }
      if(event.key == 'Enter'){
        elem = document.getElementById('All_movies');
        elem.click();
      }
      if(event.key == 'ArrowUp'){
        elem = document.getElementById('home_icon');
      }
      if(event.key == 'ArrowDown'){
        elem =  document.getElementById('Favorite_icon');
      }

       if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      } 
    }

    KeypressOnFav(event:KeyboardEvent):void{
      let elem:any;
      if(event.key == 'ArrowRight'){
        this.favMoviesService.setFocusOnSearchbar();
      }    
      if(!elem){
        event.stopPropagation();
        event.preventDefault();
      }
      if(event.key == 'Enter'){
        elem = document.getElementById('Favorite_icon');
        elem.click();
      }
      if(event.key == 'ArrowUp'){
        elem = document.getElementById('All_movies');
      }
      if(event.key == 'ArrowDown'){
        elem =  document.getElementById('actors_icon');
      }

       if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }  
    }

    KeypressOnAllActors(event:KeyboardEvent):void{
      let elem:any;
      if(event.key == 'ArrowRight'){
        if (this.allActorsService){
        this.allActorsService.setFocusOnSearchbar();
        event.stopPropagation();
        event.preventDefault();
      }if(!elem){
        this.actorService.setFocusOnSearchbar();
        event.stopPropagation();
        event.preventDefault();
      }
      }    
      if(event.key == 'Enter'){
        elem = document.getElementById('actors_icon');
        elem.click();
      }
      if(event.key == 'ArrowUp'){
        elem = document.getElementById('Favorite_icon');
      }
      if(event.key == 'ArrowDown'){
        elem =  document.getElementById('setting-icon');
      }

       if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }  
    }

    KeypressOnSetting(event:KeyboardEvent):void{
      let elem:any;
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        event.preventDefault();
      }

      if(event.key == 'Enter'){
        elem = document.getElementById('setting-icon');
        elem.click();
      }
      if(event.key == 'ArrowUp'){
        elem = document.getElementById('actors_icon');
      }
      if(event.key == 'ArrowDown'){
        elem =  document.getElementById('back_btn');
      }
      
      if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      } 

    }
    KeypressOnbackBtn(event:KeyboardEvent):void{
      let elem:any;
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        event.preventDefault();
      }

      if(event.key == 'Enter'){
        elem = document.getElementById('back_btn');
        elem.click();
      }
      if(event.key == 'ArrowUp'){
        elem = document.getElementById('setting-icon');
      }
      if(event.key == 'ArrowDown'){
        event.stopPropagation();
        event.preventDefault();
      }
      
      if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      } 

    }
   

  async ngOnInit() {
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
    const img = (await Storage.get({ key: MULTIUSER_IMG })).value;
    this.multiUserImage = environment.cloudflareUrl+img;
    this.pId = (await Storage.get({key: MULTIUSER})).value;
    this.multiUsername = (await Storage.get({key: MULTIUSER_NAME})).value;
  }

  
  ngAfterViewInit() {  
    setTimeout(() => {
      const firstElem = document.getElementById('Actors_icon');
      if(firstElem){
        firstElem.focus();
      }      
    }, 1000);
  }

  onMenuClick(id: number) {
    if (this.menuActive === id) {
      this.menuActive = 0;
    } else {
      this.menuActive = id;
    }
  }

  Backtohome(){
    this.router.navigate(['/']);
  }
  dismiss() {
    if (this.modalController) { 
      this.modalController.dismiss({
        'dismissed': true
      });
    } else {
      console.error('modalController is not initialized or undefined.');
    }
  }
}


