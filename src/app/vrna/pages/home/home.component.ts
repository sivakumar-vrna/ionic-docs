import { AfterViewInit, Component, OnDestroy, OnInit,Input,ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { VrnaflowService } from 'src/app/shared/services/vrnaflow.service';
import { isPlatform } from '@ionic/core';
import { UiRentDataService } from 'src/app/vrna/services/ui-orchestration/ui-rent-data.service';
import { environment } from 'src/environments/environment';
import { HomeService } from './home.service';
import { MovieDetailsService } from '../movie-details/movie-details.service';
import { FilterDetailsPage } from '../filter-details/filter-details.page';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { GENRES_KEY } from '../../services/ui-orchestration/orch.service';
import { Storage } from '@capacitor/storage';
import { FavoriteService } from 'src/app/components/favorite-btn/favorite.service';
import { Subject } from 'rxjs';
import videojs from 'video.js';
import { PlayerService } from 'src/app/components/player/service/player.service';
import { UserService } from 'src/app/shared/services/user.service';
import { WishListService } from 'src/app/shared/services/watchlist/wishlist.service';
import {EventsService} from 'src/app/shared/services/events.service';

interface Genre {
  id: number;
  genreDesc: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  bannerDataSource: any;
  favouritesDataSource: any;
  wishlistDataSource: any;
  rentedDataSource: any;
  continueWatchDataSource: any;
  continueWatchDataSource_loading: boolean = true;
  bannerContents: any[] = [];
  homeData: any;
  filteredData: any[] = [];
  home: any;
  displayData: any[];
  carouselLoading = true;
  loadingData = [1, 2, 3, 4, 5, 6, 7];
  featuredCast: any;
  isCapacitor: boolean;
  domainUrl: string;
  featuredCast_loading: boolean = true;
  isAppLoading:any;
  activeGenreFilter: string = '';
  continueImgs = [
    'assets/images/poster/mundasupatti-poster.jpg',
    'assets/images/poster/premam-poster.jpg',
    'assets/images/poster/happy-bhag-jayegi-poster.jpg',
    'assets/images/poster/dora-poster.jpg',
  ];

  @Input() model_title: string;
  @Input() data: any;
  @Input() type: any;

  generesFiltered: Genre[] = [];
  generes = [
    {genreDesc: 'Action'},
    {genreDesc: 'Comedy'},
    {genreDesc: 'Drama'}
  ];
  genres: any;
  genre: any;
  isLoading: boolean;
  favorite_has_update: string | null;
  continue_has_update: string | null;
  rented_has_update  : string  | null;
  wishlist_has_update  : string  | null;
  favouritesData = new Subject();
  on_moview_detail_page: boolean = false;
  public genres_temp: any[];

  public HomePageLabels = {
    home_favourite_movies: 'Favourite Movies',
    home_latest_movies: 'Latest Movies',
    home_top_rated_movies: 'Top Rated Movies',
    home_featured_movies : 'Featured Movies',
    home_trending_movies : 'Trending Movies',
    home_recommended_by_watch : 'Recommended By Watch',
    home_wishlist : 'Wishlist',
    home_featured_cast : 'Featured Cast',
    home_continue_watching : 'Continue Watching',
    home_rented_movies : 'Rented Movies',
  }
  public HomePageLabels_temp: any;  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public  modalController: ModalController,
    private vrnaflowService: VrnaflowService,
    private orchRentService: UiRentDataService,
    private homeService: HomeService,
    private movieService: MovieDetailsService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private el: ElementRef,
    private favorite: FavoriteService,
    private platform: Platform,
    private chRef: ChangeDetectorRef,
    private continue_watching: PlayerService,
    private userService: UserService,
    private wishlistService: WishListService,
    private eventsService: EventsService,
  ) {
    this.home = {};
    this.homeData = [];
    this.HomePageLabels_temp = JSON.parse(JSON.stringify(this.HomePageLabels));

    //first time on page refresh // translate    
    this.eventsService.subscribe('i18n:layout', (locale) => {      
      this.userService.translateLayout(this.HomePageLabels, this.HomePageLabels_temp, 
        locale);
      this.userService.translateGenre(locale, this.genres, this.genres_temp);
      setTimeout(() => {   
        this.translateHomeDataTitle();        
      }, 1000);
    });
  }

  keypressOnBannerTop(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      let elem = document.getElementById('btnMnu');

      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }  
    if (event.key === 'ArrowLeft') {
      event.stopPropagation();
      event.preventDefault();
    }
    if (event.key === 'ArrowRight') {
      event.stopPropagation();
      event.preventDefault();
    }
  }
  
  keypressOnGenrePop(event: KeyboardEvent): void {  
    if (event.key === 'ArrowUp') {
      event.stopPropagation();
      let elem = document.getElementById('bannerMain');
  
      if (!elem) {
        elem = document.getElementById('banner-section');
      }
      
      if (elem) {
        elem.focus();
        event.preventDefault();
      }
    }
    if(event.key == 'ArrowRight'){
      let idElemActive = document.activeElement.getAttribute('id');
      let elemPart = idElemActive.split('-');
      let idActiveIndex = parseInt(elemPart[1]);

      let numLastCard = this.genres.length-1;

      if(numLastCard == idActiveIndex){
        event.stopPropagation();
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
  }
  keypressOnGenreFilter(event:KeyboardEvent):void{
    if(event.key == 'ArrowRight'){
      let idElemActive = document.activeElement.getAttribute('id');
      let elemPart = idElemActive.split('-');
      let idActiveIndex = parseInt(elemPart[1]);

      let numLastCard = this.genres.length-1;

      if(numLastCard == idActiveIndex){
        event.stopPropagation();
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
      let elem :any;
      elem = document.getElementById('home_data_title');
      elem.focus();
      elem = document.getElementById('Upcoming Movies_carouselSwiper_0');
      if(!elem){
      elem = document.getElementById('home_section_title');
      elem.focus();
      elem = document.getElementById('rented_carouselSwiper_0');
      }
      if(!elem){
      elem = document.getElementById('home_section_title');
      elem.focus();
      elem = document.getElementById('favorite_carouselSwiper_0');
      }
      if(!elem){
      elem = document.getElementById('home_section_title');
      elem.focus(); 
      elem = document.getElementById('continue_watch-0');
      }
      if(!elem){
      elem = document.getElementById('genrePop-0');
      }

      if(elem){
        event.stopPropagation();
        let focusElem = elem.id;
        let elemPart = focusElem.split('_');
        if(elemPart[1] == 'carouselSwiper'){
          elem.click();
        }else{
          elem.focus();
        }          
        event.preventDefault();
      }

      /*if(elem){
        event.stopPropagation();
        elem.click();
        event.preventDefault();
      }*/
    }
}
  keypressOnFilteredData(event: KeyboardEvent, filteredData: any): void {
    // 1)for future purpose

    // if (event.key === 'ArrowDown') {
    //     if(filteredData){
    //       filteredData= document.getElementById('Latest Movies_carouselSwiper_0');
    //     }
    //     if(filteredData){
    //       event.stopPropagation();
    //       filteredData.focus();
    //       event.preventDefault();
    //     }
    // }

    //2) Slideto index 0 after filter
    // 1 & 2 future purpose
}
keypressOnHomeSection(event: KeyboardEvent, sectionName: string): void {   
    

    if(event.key == 'ArrowUp'){
      // if(sectionName == 'Latest Movies'){
       
      // }else{
      //   const arrSection = ['continue_watch', 'favorite', 'rented', 
      //   'Upcoming Movies', 'Latest Movies', 'top_rated', 'featured', 'trending',
      //    'recommended','wishlist', 'featured_cast'];

         let elem: any;

        //go to genre section
        if(sectionName == 'continue_watch'){
          elem = document.getElementById('genrePop-0');                    
        }

        if(sectionName == 'favorite'){
          elem = document.getElementById('home_section_title');
          elem.focus();
          elem = document.getElementById('continue_watch-0');
          if(!elem){
            elem = document.getElementById('genrePop-0');            
          }          
        }

        if(sectionName == 'rented'){
          elem = document.getElementById('home_section_title');
          elem.focus();
          elem = document.getElementById('favorite_carouselSwiper_0');
          if(!elem){
            elem = document.getElementById('home_section_title');
            elem.focus();
            elem = document.getElementById('continue_watch-0');
            if(!elem){
              elem = document.getElementById('genrePop-0');            
            }
          }          
        }
        
        if(sectionName == 'Upcoming Movies'){
          elem = document.getElementById('home_section_title');
          elem.focus();
          elem = document.getElementById('rented_carouselSwiper_0');
          if(!elem){
            elem = document.getElementById('home_section_title');
            elem.focus();
            elem = document.getElementById('favorite_carouselSwiper_0');
            if(!elem){
              elem = document.getElementById('home_section_title');
              elem.focus();
              elem = document.getElementById('continue_watch-0');
              if(!elem){
                elem = document.getElementById('genrePop-0');            
              }
            }
          }                   
        }
        
        if(sectionName == 'Latest Movies'){
         elem=document.getElementById('genreFilter-0');
          if(!elem){
          elem = document.getElementById('home_data_title');
          elem.focus();
          elem = document.getElementById('Upcoming Movies_carouselSwiper_0');
          if(!elem){
            elem = document.getElementById('home_section_title');
            elem.focus();
            elem = document.getElementById('rented_carouselSwiper_0');
            if(!elem){
              elem = document.getElementById('home_section_title');
              elem.focus();
              elem = document.getElementById('favorite_carouselSwiper_0');
              if(!elem){
                elem = document.getElementById('home_section_title');
                elem.focus();
                elem = document.getElementById('continue_watch-0');
                if(!elem){
                  elem = document.getElementById('genrePop-0');            
                }
              }
            }
          }  
        }
      }


        if(sectionName == 'Top Rated Movies'){
          elem = document.getElementById('home_data_title');
          elem.focus();
          elem = document.getElementById('Latest Movies_carouselSwiper_0');
          if(!elem){
            elem=document.getElementById('genreFilter-0');
          if(!elem){
            elem = document.getElementById('home_data_title');
            elem.focus();
            elem = document.getElementById('Upcoming Movies_carouselSwiper_0');
          if(!elem){
            elem = document.getElementById('home_section_title');
            elem.focus();
            elem = document.getElementById('rented_carouselSwiper_0');
            if(!elem){
              elem = document.getElementById('home_section_title');
              elem.focus();
              elem = document.getElementById('favorite_carouselSwiper_0');
              if(!elem){
                elem = document.getElementById('home_section_title');
                elem.focus();
                elem = document.getElementById('continue_watch-0');
                if(!elem){
                  elem = document.getElementById('genrePop-0');            
                }
              }
            }
          }                             
        }
      }
    }

        if(sectionName == 'Featured Movies'){
          elem = document.getElementById('home_data_title');
          elem.focus();
          elem = document.getElementById('Top Rated Movies_carouselSwiper_0');
          if(!elem){
            elem = document.getElementById('home_data_title');
            elem.focus();
            elem = document.getElementById('Latest Movies_carouselSwiper_0');
            if(!elem){
              elem=document.getElementById('genreFilter-0');
            if(!elem){
              elem = document.getElementById('home_data_title');
              elem.focus();
              elem = document.getElementById('Upcoming Movies_carouselSwiper_0');
            if(!elem){
              elem = document.getElementById('home_section_title');
              elem.focus();  
              elem = document.getElementById('rented_carouselSwiper_0');
              if(!elem){
                elem = document.getElementById('home_section_title');
                elem.focus();  
                elem = document.getElementById('favorite_carouselSwiper_0');
                if(!elem){
                  elem = document.getElementById('home_section_title');
                  elem.focus();  
                  elem = document.getElementById('continue_watch-0');
                  if(!elem){
                    elem = document.getElementById('genrePop-0');            
                  }
                }
              }
            }
          }                                       
        }
      }
    }
        if(sectionName == 'Trending Movies'){
          elem = document.getElementById('home_data_title');
          elem.focus();
          elem = document.getElementById('Featured Movies_carouselSwiper_0');
          if(!elem){
            elem = document.getElementById('home_data_title');
            elem.focus();
            elem = document.getElementById('Top Rated Movies_carouselSwiper_0');
            if(!elem){
              elem = document.getElementById('home_data_title');
              elem.focus();
              elem = document.getElementById('Latest Movies_carouselSwiper_0');
              if(!elem){
                elem=document.getElementById('genreFilter-0');
              if(!elem){
                elem = document.getElementById('home_data_title');
                elem.focus();
                elem = document.getElementById('Upcoming Movies_carouselSwiper_0');
              if(!elem){
                elem = document.getElementById('home_section_title');
                elem.focus();  
                elem = document.getElementById('rented_carouselSwiper_0');
                if(!elem){
                  elem = document.getElementById('home_section_title');
                  elem.focus();  
                  elem = document.getElementById('favorite_carouselSwiper_0');
                  if(!elem){
                    elem = document.getElementById('home_section_title');
                    elem.focus();  
                    elem = document.getElementById('continue_watch-0');
                    if(!elem){
                      elem = document.getElementById('genrePop-0');            
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
        if(sectionName == 'Recommended By Watch'){  
          elem = document.getElementById('home_data_title');
          elem.focus();       
          elem = document.getElementById('Trending Movies_carouselSwiper_0');
          if(!elem){
            elem = document.getElementById('home_data_title');
            elem.focus();    
            elem = document.getElementById('Featured Movies_carouselSwiper_0');
            if(!elem){
              elem = document.getElementById('home_data_title');
              elem.focus();    
              elem = document.getElementById('Top Rated Movies_carouselSwiper_0');
              if(!elem){
                elem = document.getElementById('home_data_title');
                elem.focus();    
                elem = document.getElementById('Latest Movies_carouselSwiper_0');
                if(!elem){
                  elem=document.getElementById('genreFilter-0');
                if(!elem){
                  elem = document.getElementById('home_data_title');
                  elem.focus();    
                  elem = document.getElementById('Upcoming Movies_carouselSwiper_0');
                  if(!elem){
                  elem = document.getElementById('home_section_title');
                  elem.focus();  
                  elem = document.getElementById('rented_carouselSwiper_0');
                  if(!elem){
                    elem = document.getElementById('home_section_title');
                    elem.focus();
                    elem = document.getElementById('favorite_carouselSwiper_0');
                    if(!elem){
                      elem = document.getElementById('home_section_title');
                      elem.focus();
                      elem = document.getElementById('continue_watch-0');
                      if(!elem){
                        elem = document.getElementById('genrePop-0');            
                      }
                    }
                  }
                }
              }
            }
          }          
        }
      }
    } 
        if(sectionName == 'wishlist'){
            elem = document.getElementById('home_data_title');
            elem.focus();
            elem = document.getElementById('Recommended By Watch_carouselSwiper_0');
            if(!elem){
            elem = document.getElementById('home_data_title');
            elem.focus();
            elem = document.getElementById('Trending Movies_carouselSwiper_0');
            if(!elem){
            elem = document.getElementById('home_data_title');
            elem.focus();
            elem = document.getElementById('Featured Movies_carouselSwiper_0');
            if(!elem){
            elem = document.getElementById('home_data_title');
            elem.focus();
            elem = document.getElementById('Top Rated Movies_carouselSwiper_0');
            if(!elem){
            elem = document.getElementById('home_data_title');
            elem.focus();
            elem = document.getElementById('Latest Movies_carouselSwiper_0');
            if(!elem){
              elem=document.getElementById('genreFilter-0');
            if(!elem)  {
            elem = document.getElementById('home_data_title');
            elem.focus();  
            elem = document.getElementById('Upcoming Movies_carouselSwiper_0');
            if(!elem){
            elem = document.getElementById('home_section_title');
            elem.focus();  
            elem = document.getElementById('rented_carouselSwiper_0');
            if(!elem){
            elem = document.getElementById('home_section_title');
            elem.focus();  
            elem = document.getElementById('favorite_carouselSwiper_0');
            if(!elem){
            elem = document.getElementById('home_section_title');
            elem.focus();  
            elem = document.getElementById('continue_watch-0');
            if(!elem){
            elem = document.getElementById('genrePop-0');
                    }
                  }
                }
              }
            }
          }
        }
      }
    } 
  }
}

        if(sectionName == 'featured_cast'){
          elem = document.getElementById('home_data_title');
          elem.focus();
          elem = document.getElementById('wishlist_carouselSwiper_0');
          if(!elem){
            elem = document.getElementById('home_data_title');
            elem.focus();
            elem = document.getElementById('Recommended By Watch_carouselSwiper_0');
          }
          if(!elem){
            elem = document.getElementById('home_data_title');
            elem.focus();
            elem = document.getElementById('Trending Movies_carouselSwiper_0');
            if(!elem){
              elem = document.getElementById('home_data_title');
              elem.focus();
              elem = document.getElementById('Featured Movies_carouselSwiper_0');
              if(!elem){
                elem = document.getElementById('home_data_title');
                elem.focus();
                elem = document.getElementById('Top Rated Movies_carouselSwiper_0');
                if(!elem){
                  elem = document.getElementById('home_data_title');
                  elem.focus();
                  elem = document.getElementById('Latest Movies_carouselSwiper_0');
                  if(!elem){
                  elem=document.getElementById('genreFilter-0');
                  if(!elem){
                  elem = document.getElementById('home_data_title');
                  elem.focus();
                   elem = document.getElementById('Upcoming Movies_carouselSwiper_0'); 
                  if(!elem){
                    elem = document.getElementById('home_section_title');
                    elem.focus();
                    elem = document.getElementById('rented_carouselSwiper_0');
                    if(!elem){
                      elem = document.getElementById('home_section_title');
                      elem.focus();
                      elem = document.getElementById('favorite_carouselSwiper_0');
                      if(!elem){
                        elem = document.getElementById('home_section_title');
                        elem.focus();
                        elem = document.getElementById('continue_watch-0');
                        if(!elem){
                          elem = document.getElementById('genrePop-0');            
                        }
                      }
                    }
                  }
                }
              }
            }
          }               
        }
      }  
    }       

        if(elem){
          event.stopPropagation();
          let focusElem = elem.id;
          let elemPart = focusElem.split('_');
          if(elemPart[1] == 'carouselSwiper'){
            elem.click();
          }else{
            elem.focus();
          }          
          event.preventDefault();
        }
      }
      
      
      // event.stopPropagation();
      // const elem = document.getElementById('bannerMain');
      // elem.focus();      
      // event.preventDefault();
      
    }    
  // }

    async ngOnInit() {

      

      try{    
        this.isAppLoading = await this.loadingCtrl.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
        });
        await this.isAppLoading.present();
      } catch(err){}    

      //it should get loaded first as it pull all rented movies and stores the keys in Local.
      this.orchRentService.userRentedMovies();

  
      this.home = {};
      this.homeData = [];
      this.route.queryParams.subscribe((params) => {
      const movieId = params.id;
      if (movieId) {
        this.on_moview_detail_page = true;
        this.movieService.movieDetailsModal(movieId);
      }
    });    

    this.isCapacitor = isPlatform('capacitor');    
    
    this.update_favorite(); //for favorites 
    this.update_continue(); //for continue watching 
    this.update_rented(); // for rented movies
    this.update_wishlist(); // for wishlist realtime updates

    //add a delay as Local data may not be ready at this time // for movie alone
    setTimeout(() => {
      this.triggerHomeData();

      this.getBannerData();
      this.getContinueWatchData();
      this.getFavouritesData();
      this.getWishlistData();
      this.getRentedData();
      this.getHomeData();
      
    }, 500);

    //no delay is needed for cast data
    this.getFeaturedCast();
    this.displayData = this.home && this.home.data ? [...this.home.data] : [];
    this.chRef.detectChanges();
}

 async ngAfterViewInit() {
    setTimeout(() => {
      this.loadGenreFromLocal();      

      //translate static labels // on page loads
      let user_locale = environment.user_locale;  
      this.userService.translateLayout(this.HomePageLabels, this.HomePageLabels_temp, 
        user_locale);      

    }, 2500);
  }

  

  async translateHomeDataTitle(){
    this.homeData.map((menu, index) => {      
      Object.keys(menu).forEach(function(key) {
        if(key == 'title'){
          let title = menu[key].toLowerCase();
          title = 'home_'+title.split(' ').join('_');
          if(this.HomePageLabels[title] != ''){
            menu[key+'_i18n'] = this.HomePageLabels[title];
          }
        }
      }.bind(this));
    });
  }

  async loadGenreFromLocal(){
    await Storage.get({ key: GENRES_KEY }).then((data) => {
      this.genres = JSON.parse(data.value);
      this.genres_temp = JSON.parse(JSON.stringify(this.genres));
      this.userService.translateGenre(environment.user_locale, this.genres, this.genres_temp);
      this.chRef.detectChanges();    
    });
  }

  ionViewDidEnter() {
    if(this.isAppLoading){
      this.isAppLoading.dismiss();
    }    
  }

  triggerHomeData() {
    this.homeService.getBannerData();
    this.homeService.getContinueWatchData();
    this.homeService.getFavouriteData();
    this.homeService.getWishlistData();
    this.homeService.getRentedData();
    this.homeService.getHomeData();
    this.homeService.getFeaturedCast();
  }

  getBannerData() {    
    this.homeService.bannerData.subscribe((data: any[]) => {    
      if (data !== null) {
        this.bannerContents = data;
      } else {
        this.bannerContents = [];
      }
      this.chRef.detectChanges();
      //data = null;      
    });
  }

  getContinueWatchData() {
    this.homeService.continueWatchData.subscribe((data) => {
      if (data !== null) {
        this.continueWatchDataSource = data;
      } else {
        this.continueWatchDataSource = null;
      }
      this.continueWatchDataSource_loading = false;
      this.chRef.detectChanges();
      //data = null;
    });
  }

  update_continue(){  //for continue watch update
    this.continue_watching.continue_update$.subscribe(async (value) => { 
      this.continue_has_update = value;
      if(this.continue_has_update){
        this.homeService.getContinueWatchData();
      }
      this.chRef.detectChanges();
    });
  }

  getFavouritesData() {
    this.homeService.favouritesData.subscribe((data) => {
      if (data !== null) {
        this.favouritesDataSource = data;
      } else {
        this.favouritesDataSource = null;
      }
      this.chRef.detectChanges();
      //data = null;
    });
  }

  getWishlistData() {
    this.homeService.wishlistData.subscribe((data) => {
      if (data !== null) {
        this.wishlistDataSource = data;
      } else {
        this.wishlistDataSource = null;
      }
      this.chRef.detectChanges();
      //data = null;
    });
  }

  update_favorite(){
    this.favorite.favorite_update$.subscribe(async (value) => {
      this.favorite_has_update = value;
      if(this.favorite_has_update){
        this.homeService.getFavouriteData();
      }
      this.chRef.detectChanges();
    });
  }

  getRentedData() {
    this.homeService.rentedData.subscribe((data) => {
      if (data !== null) {
        this.rentedDataSource = data;
      } else {
        this.rentedDataSource = null;
      }
      this.chRef.detectChanges();
      //data = null;
    });
  }
  
  update_rented(){
    this.orchRentService.rented_update$.subscribe(async (value) => {
      this.rented_has_update = value;
      if(this.rented_has_update){
        this.orchRentService.userRentedMovies(); //needed this to refresh the localstorage with all rented data

        setTimeout(() => {
          //this.homeService.getRentedData();
          this.homeService.getAllHomeData(); //loading all homedata as we need rented tag
          if(this.activeGenreFilter != ''){
            this.filterByGenre(this.activeGenreFilter);
          }
          this.chRef.detectChanges();
        }, 2500);
      }
    });
  }

  update_wishlist(){
    this.wishlistService.wishlist_update$.subscribe(async (value) => {
      this.wishlist_has_update = value;
      if(this.wishlist_has_update){
        this.homeService.getWishlistData();
        this.chRef.detectChanges();
      }
    });
  }

   getHomeData() {
    this.homeService.homeData$.subscribe((data) => {
      if (data !== null) {
        this.homeData = data;

        //translate the dynamic section titles
        this.translateHomeDataTitle();                      

      } else {
        this.home = {};
        this.homeData = null;
      }
      this.chRef.detectChanges();
      //data = null; //clear memory for garbage collection
    });
  }

  getFeaturedCast() {
    this.homeService.featuredCastData.subscribe((data) => {
      if (data !== null) {
        this.featuredCast = data;
      } else {      
        this.featuredCast = null;
      }
      this.chRef.detectChanges();
      this.featuredCast_loading = false;
    });
  }
  
  async old_getFeaturedCast() {
    (await this.vrnaflowService.featuredCast()).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {

          this.featuredCast = res.data;

          /*
          let data_featuredCast = res.data;
          data_featuredCast = data_featuredCast.slice(0, 15);        
          this.featuredCast = data_featuredCast;
          */

          //map the cast data with correct url
          this.featuredCast?.map(castmap => {
            //cast['imageUrl'] = this.domainUrl + '/images' + cast.imageUrl;
            castmap['imageUrl'] = environment.cloudflareUrl + castmap.imageUrl;
          });


          //clear memory for garbage colection
          //res = null;
          //data_featuredCast = null;
        } else {
          // this.presentToast('Featured Caste Error: ' + JSON.stringify(res), 'danger');
        }

        this.chRef.detectChanges();

        this.featuredCast_loading = false;
      },
      (err) => {
        this.featuredCast_loading = false;
        // this.presentToast('Featured Caste Error: ' + err, 'danger');
      }
    );
  }

  doRefresh(event) {
    this.homeService.getAllHomeData();
    setTimeout(() => {
      if(this.activeGenreFilter != ''){
        this.filterByGenre(this.activeGenreFilter);
      }
      event.target.complete();
      this.chRef.detectChanges();
    }, 2000);
  }

  ngOnDestroy() {
    /*
    if (this.homeService.bannerData) {
      this.homeService.bannerData.unsubscribe();
    }
    if (this.homeService.homeData$) {
      this.homeService.homeData$.unsubscribe();
    }
    */ 
  }
  
  getSlidesPerView() {
    return this.platform.width() >= 768 ? 3 : 3 ;
  }

  async openIonModal(data) {
    let modal: any;
    try{
      modal = await this.modalController.create({
        component: FilterDetailsPage,
        cssClass: 'filtered-pop',
        componentProps: {
          'model_title':  data.genreDesc,
          'data': data,
          'type': 'genre'
        }
      });    

      modal.onDidDismiss().then((modelData) => {
        if (modelData !== null) {
        }
      });

    } catch(err){
      console.log(err);
    }

    return await modal.present();
  }

  async filterByGenre(genre: any) {
    this.activeGenreFilter = genre;
    const loading = await this.loadingCtrl.create({
      message: genre.genreDesc,
      spinner: 'bubbles',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();
    const rentedContents: any = await this.userService.getRentedMoviesList();
    try {
      const res = (await this.vrnaflowService.getDataByGenre(genre.genreId)).subscribe( 
        (res: any) => {
          this.filteredData = res.data;

          this.filteredData?.map(item => {
            item['posterurl'] = environment.cloudflareUrl + item.posterurl;
            let isRented: boolean = false;
            if (rentedContents !== undefined && rentedContents !== null && rentedContents?.length > 0) {
              isRented = rentedContents?.find(x => x === item?.movieId) ? true : false;
            }
            item['isRented'] = isRented;
          });
          if (this.homeData) {
            this.home = {
              data: this.homeData
            }
            this.displayData = [...this.homeData, ...this.filteredData];
          } else {
            this.displayData = this.filteredData;
          }          
          if (this.filteredData.length === 0) {
            this.displayData = this.filteredData; 
          }

          loading.dismiss();

          /*
          //state change of the genre button if required//
          var elemGenre = document.getElementsByClassName('genre-clselem-'+genre.genreDesc);
          if(elemGenre){
            let elem = elemGenre[0] as HTMLElement;
            if(elem){
              elem.focus();
            }
          }
          */

          this.chRef.detectChanges();   
        }
      );
    } catch (error) {
      console.error(error);
      loading.dismiss();
    }
  }

}
