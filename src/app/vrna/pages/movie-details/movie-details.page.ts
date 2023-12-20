import { AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { isPlatform, ModalController } from '@ionic/angular';
import { BackgroundColorOptions } from '@capacitor/status-bar';
import { Share } from '@capacitor/share';
import { ActivatedRoute, Router } from '@angular/router';
import { RentService } from 'src/app/components/rent/rent.service';
import { FilterDetailsPage } from '../filter-details/filter-details.page';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Subscription } from 'rxjs';
import { PlayerService } from 'src/app/components/player/service/player.service';
import { MovieService } from '../../services/movie/movie.service';
import { UiRentDataService } from '../../services/ui-orchestration/ui-rent-data.service';
import { DOCUMENT } from '@angular/common';
import { CastDetailsPage } from '../cast-details/cast-details.page';
import { environment } from 'src/environments/environment';
import { SwiperOptions } from 'swiper';
import { COUNTRY_KEY, CURRENCY_KEY, OrchService } from '../../services/ui-orchestration/orch.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { Storage } from '@capacitor/storage';
import { ToastController} from '@ionic/angular';
import { LocationComponent } from 'src/app/components/location/location.component';
import { UserService } from 'src/app/shared/services/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { SocialShareComponent } from '../social-share/social-share.component';
// import { WishListService } from '../../../shared/services/watchlist/wishlist.service';
import videojs from 'video.js';
import { WishListService } from 'src/app/shared/services/watchlist/wishlist.service';
import {SeoService} from 'src/app/shared/services/seo.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { EventsService } from 'src/app/shared/services/events.service';


export const GENRES_KEY = 'genres';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
})

export class MovieDetailsPage implements OnInit, AfterViewInit, OnDestroy {
  @Input() movieId: number;

  domainUrl: string;
  opts: BackgroundColorOptions = {
    color: '#000000'
  }
  currency: string = '';
  suggestionOptions_loading: boolean = true;

  suggestionOptions: SwiperOptions = {
    centeredSlides: false,
    loop: false,
    breakpoints: {
      0: {
        slidesPerView: 2.1,
        spaceBetween: 10,
      },
      576: {
        slidesPerView: 2.2,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 10,
      },
      992: {
        slidesPerView: 2.1,
        spaceBetween: 10,
      },
      1200: {
        slidesPerView: 3.1,
        spaceBetween: 15,
      },
      1400: {
        slidesPerView: 3.1,
        spaceBetween: 15,
      },
    },
  };

  wishIcon = "add-outline";
  isLiked: boolean = false;
  inWishList: boolean = false;
  isBlocked: boolean = false;
  userId: number;
  currentTime: number = 0;  
  totalDuration: number = 0;
  currentDate: Date = new Date();
  movieDetails: any;
  casts: any;
  isLoading = true;
  routeSub: Subscription;
  suggestions = [];
  genresDataSrc: any;
  tempGenres: any;
  genreMap: any;  
  loading = false;
  uniquePageId: any;
  user_locale: string;

  // #For Skeleton Loader
  skeletonData = [1, 2, 3, 4, 5, 6];
  
  public MoviePageLabels = {
    director: 'Director',
    producer: 'Producer',
    musician: 'Musician',
    vrna_rating: 'VRNA Rating',
    available_for_rent: 'Available for Rent',
    rented_movies_usage_notice: 'Rented movies will be available for 2 days after the purchase. you can watch the movie 2 times in the period',
    play:'Play',
    rent:'Rent',
    trailer:'Trailer',
    favorite: 'Favorite',
    share: 'Share',
    wishlist: 'Wishlist',
    not_for_me: 'Not for me',
    like:'Like',
    subtitles:'Subtitles',
    audio_languages:'Audio languages',
    top_cast:'Top Sast',
    related_suggestions: 'Related Suggestions',
    releasing_soon:'Releasing soon ...'
  };
  
  public MoviePageLabels_temp: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public modalController: ModalController,
    private movieService: MovieService,
    private router: Router,
    private rentService: RentService,
    private utilityService: UtilityService,
    private route: ActivatedRoute,
    private player: PlayerService,
    private rentedDataService: UiRentDataService,
    private orchService: OrchService,
    public toast: ToastWidget,
    private toastController: ToastController,    
    private userService: UserService,
    private wishListService: WishListService,
    private chRef: ChangeDetectorRef,
    public modalCtrl: ModalController,
    private seoService: SeoService,
    private httpService: HttpService,
    private errorService: ErrorService,
    private eventsService: EventsService,

  ) {
    if (isPlatform('capacitor')) {
      this.domainUrl = environment.capaciorUrl;
    } else {
      this.domainUrl = (window as any).location.origin;

      //this.httpService.setupCloudflareCountry(environment.baseUrl);

    }
    this.routeSub = this.route.params.subscribe(params => {
      this.movieId = params['id']; // Movie id is captured here
    });

    this.MoviePageLabels_temp = JSON.parse(JSON.stringify(this.MoviePageLabels));
    //first time on page refresh // translate    
    this.eventsService.subscribe('i18n:layout', (locale) => {      
      this.userService.translateLayout(this.MoviePageLabels, this.MoviePageLabels_temp, 
        locale);
    });
  }  

  /*

  @HostListener('click',['$event'])
  documentClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    let elem = document.getElementById('id-bg-overlay');
    elem.click();
    alert('clicked ');
    event = null;
    return false;
    return confirm('Are you sure?');    
  }
  */

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }  

  handleKeyboardEventOnSlider(event: KeyboardEvent, movieId=0): void {    
    let elem: any;
    if(event.key == 'ArrowUp'){
      elem = document.getElementById('id_topcast');
      elem.focus();
      elem = document.getElementById('top_cast_clider-0_'+this.uniquePageId);
      if(!elem){
      elem = document.getElementById('movie_genre-0'+'_'+this.uniquePageId);
      }            
    }
    if(event.key == 'ArrowDown'){
      event.stopPropagation();
      event.preventDefault();                
    }
    if(event.key == 'ArrowRight'){
      let idElemActive = document.activeElement.getAttribute('id');
      let elemPart = idElemActive.split('-');
      let idActiveIndex = parseInt(elemPart[1]);

      let numLastCard = this.suggestions.length-1;

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

    if(elem){
      event.stopPropagation();
      elem.focus();
      this.chRef.detectChanges();
      event.preventDefault();
    }  
  }

  keypressOnPlayRow(event: KeyboardEvent): void {
    let elem: any;
    if(event.key == 'ArrowUp'){
      elem = document.getElementById('btnPlayTrailer');                 
    }
    
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('top_cast_clider-0');
      if(!elem){
        elem = document.getElementById('cardSuggestions-0');
      }              
    }
    
    if(elem){
      event.stopPropagation();
      elem.focus();
      this.chRef.detectChanges();
      event.preventDefault();
    }
  }
  keypressOnBannerImg(event:KeyboardEvent):void{
    let elem:any;
    if(event.key == 'ArrowDown'){
      elem =document.getElementById('btn_star-1'+'-'+this.uniquePageId);
    }
    if(event.key == 'ArrowUp'){
      elem = document.getElementById('btnBack_Movie_detail'+this.uniquePageId)
    }
  }

  handleKeyboardEventOnPlayBtn(event: KeyboardEvent): void {    
    let elem:any;
    if(event.key == 'ArrowDown'){  
      event.stopPropagation();       
      
      elem = document.getElementById('movie_genre-0'+'_'+this.uniquePageId);      
      elem.focus();

      elem = document.getElementById('btn-trailer'+'_'+this.uniquePageId);
      elem.focus();
      
      event.preventDefault();

    }

    if(event.key == 'ArrowRight'){
      event.stopPropagation();       

      elem = document.getElementById('BannerImg'+this.uniquePageId);      
      elem.focus();

      elem = document.getElementById('btn_star-1'+'-'+this.uniquePageId);      
      elem.focus();

      event.preventDefault();                
    }

    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();
    }

    if(event.key == 'ArrowUp'){
      event.stopPropagation();       

      elem = document.getElementById('BannerImg'+this.uniquePageId);      
      elem.focus();

      elem = document.getElementById('btn_star-1'+'-'+this.uniquePageId);      
      elem.focus();

      event.preventDefault();
      
    }        
    if(elem && event.key != 'ArrowUp' && event.key != 'ArrowDown'){
      event.stopPropagation();       
      elem.focus();
      event.preventDefault();
    }
  }

  kepressOnPlayTrailerBtn(event: KeyboardEvent): void {
    let elem: any;
    if(event.key == 'ArrowDown'){      
      elem = document.getElementById('movie_genre-0'+'_'+this.uniquePageId);        
    }

    if(event.key == 'ArrowRight'){
      elem = document.getElementById('btnFav'+'_'+this.uniquePageId);                  
    }

    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();                 
    }

   
    if(elem){   
      event.stopPropagation();         
      elem.focus();
      this.chRef.detectChanges();
      event.preventDefault();
    }    

  }

  keypressOnMovieIconSlide(event: KeyboardEvent): void {
    let elem: any;
    if(event.key == 'ArrowUp'){
      elem = document.getElementById('btnPlayOrRent'+this.uniquePageId);  
    }
    if(event.key == 'ArrowDown'){      
      elem = document.getElementById('movie_genre-0'+'_'+this.uniquePageId);        
    }
    if(elem){  
      event.stopPropagation();          
      elem.focus();
      event.preventDefault();
    }  
  }


  keypressOnCastBtn(event: KeyboardEvent): void { 
    
    let elem: any;   
    if(event.key == 'ArrowUp'){
      elem = document.getElementById('btnPlayTrailer');                  
    }
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('btnPlayOrRent'+this.movieId);                  
    }
    if(elem){
      event.stopPropagation(); 
      elem.focus();
      this.chRef.detectChanges();
      event.preventDefault();
    }
  }
  

  keypressOnFavBtn(event: KeyboardEvent): void {    
    let elem: any;
    if(event.key == 'ArrowRight'){
      elem = document.getElementById('share-social-btn'+'_'+this.uniquePageId);      
    }    
    if(event.key == 'ArrowLeft'){
      elem = document.getElementById('btn-trailer'+'_'+this.uniquePageId);      
    }  
    if(event.key == 'ArrowDown'){
      elem = this.document.getElementById('movie_genre-0'+'_'+this.uniquePageId);
    }  
      
    if(elem){
      event.stopPropagation();
      elem.focus();
      this.chRef.detectChanges();
      event.preventDefault();
    }    
  }

  keypressOnShareBtn(event: KeyboardEvent): void {    
    let elem: any;
    if(event.key == 'ArrowRight'){
      elem = document.getElementById('Wishlist-btn'+'_'+this.uniquePageId);      
    }    
    if(event.key == 'ArrowLeft'){
      elem = document.getElementById('btnFav'+'_'+this.uniquePageId);      
    }    
    if(event.key == 'ArrowDown'){
      elem = this.document.getElementById('movie_genre-0'+'_'+this.uniquePageId);
    }  
       
    if(elem){
      event.stopPropagation();
      elem.focus();
      this.chRef.detectChanges();
      event.preventDefault();
    }  
  }

  keypressOnWishBtn(event: KeyboardEvent): void {    
    
    let elem: any;
    if(event.key == 'ArrowRight'){
      elem = document.getElementById('dislike-btn'+'_'+this.uniquePageId);      
    }    
    if(event.key == 'ArrowLeft'){
      elem = document.getElementById('share-social-btn'+'_'+this.uniquePageId);      
    }   
    if(event.key == 'ArrowDown'){
      elem = this.document.getElementById('movie_genre-0'+'_'+this.uniquePageId);
    }   
      
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }    
  }

  keypressOnDislikeBtn(event: KeyboardEvent): void {    
    
    let elem: any;
    if(event.key == 'ArrowRight'){
      elem = document.getElementById('like-btn'+'_'+this.uniquePageId);      
    }    
    if(event.key == 'ArrowLeft'){
      elem = document.getElementById('wishlist-btn'+'_'+this.uniquePageId);      
    }    
    if(event.key == 'ArrowDown'){
      elem = this.document.getElementById('movie_genre-0'+'_'+this.uniquePageId);
    }  
       
    if(elem){
      event.stopPropagation();
      elem.focus();
      this.chRef.detectChanges();
      event.preventDefault();
    }
  }

  keypressOnLikeBtn(event: KeyboardEvent): void {    
    
    let elem: any;
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();      
    }    
    if(event.key == 'ArrowLeft'){
      elem = document.getElementById('dislike-btn'+'_'+this.uniquePageId);      
    } 
    if(event.key == 'ArrowDown'){
      elem = this.document.getElementById('movie_genre-0'+'_'+this.uniquePageId);
    }     
       
    if(elem){ 
      event.stopPropagation();     
      elem.focus();
      event.preventDefault();
    }     
  }
 


  keypressOnMovieGenre(event: KeyboardEvent, currentIndex: number): void {
    let elem: any;
  
    if (event.key === 'ArrowRight') {
      if (currentIndex < this.movieDetails.genre.length - 1) {
        elem = document.getElementById(`movie_genre-${currentIndex + 1}`+'_'+this.uniquePageId);
      } else {
        event.stopPropagation();
        event.preventDefault();
      }
    } else if (event.key === 'ArrowLeft') {
      if (currentIndex > 0) {
        elem = document.getElementById(`movie_genre-${currentIndex - 1}`+'_'+this.uniquePageId);
      } else {
        event.stopPropagation();
        event.preventDefault();
      }
    } else if(event.key === 'ArrowUp'){
      elem = document.getElementById('btn-trailer'+'_'+this.uniquePageId);
    } else if(event.key === 'ArrowDown'){
      elem  = document.getElementById('top_cast_clider-0_'+this.uniquePageId);
    }
  
    if (elem) {
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }
  


  keypressOnBackBtn(event: KeyboardEvent): void {  
    
    if(event.key == 'ArrowDown' || event.key == 'ArrowRight'){
      let btn = document.getElementById('btn_star-1'+'-'+this.uniquePageId);
      event.stopPropagation();
      btn.focus();
      this.chRef.detectChanges();
      event.preventDefault();            
    }
    if(event.key == 'ArrowUp' || event.key == 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();            
    }
  }

  async ngOnInit() {

    this.user_locale = environment.default_locale;
    let json_user_locale = await Storage.get({ key: 'user_locale'});
    if(json_user_locale.value != null && json_user_locale.value != ''){
      this.user_locale = json_user_locale.value;
    }


     // for uniquePageId
     this.uniquePageId = Math.random().toString(36).substring(2, 15) +
     Math.random().toString(36).substring(2, 15);

 
    this.userId = await this.userService.getUserId();

    //if user did not logged in yet; then loading few API
    if(isNaN(this.userId) || this.userId == null){
      await this.sleep(3000);
    }

    this.tempGenres = await Storage.get({ key: GENRES_KEY });    
    this.genresDataSrc = JSON.parse(this.tempGenres.value);
    this.genreMap = new Map<number, string>();
    for (let i=0;i<this.genresDataSrc.length;i++){
      var genre = this.genresDataSrc[i];
      this.genreMap.set(genre.genreId,genre.genreDesc)
    }   

    this.getSuggestions();
    
    this.onGetMovieDetail();
    
    //translate static labels // on page switch lang    
    this.userService.translateLayout(this.MoviePageLabels, this.MoviePageLabels_temp, 
      this.user_locale);    

    

    //if(this.user_locale != 'en'){ // commenting this to allowing to edit english labels from admin

      //translating the movie*
      const evt_channel_name = 'i18n:dynamic_movie_' + this.movieId;
      this.eventsService.subscribe(evt_channel_name, (movie_data) => {
        if(movie_data?.[0].attributes != null){
          Object.keys(movie_data?.[0].attributes).forEach(function(key) {
            if(movie_data?.[0].attributes[key] != null && 
              movie_data?.[0].attributes[key] != ''){
              if (typeof movie_data?.[0].attributes[key] === 'object' && movie_data?.[0].attributes[key]['data'] != null) {
                this.movieDetails[key] = movie_data?.[0].attributes[key]['data'];
              } else{
                this.movieDetails[key] = movie_data?.[0].attributes[key];
              }
            }
          }.bind(this));
        }        

      });      

    //}
    

    this.rentedDataService.rentedMoviesList$?.subscribe(async (list: any) => {
      const isRented = await this.utilityService.isRented(this.movieDetails);
      if (this.movieDetails) {
        this.movieDetails['isRented'] = isRented;
      }
      this.chRef.detectChanges();
    });

    const players = videojs.getAllPlayers();
    players.forEach(function (player) {
      if(!player.paused()){
        player.pause();
      }
    });     
    this.getWishListStatus();
    this.getLikeStatus();
    this.getBlockedStatus();
  }

  getGenreDesc(id:number){    
    return this.genreMap.get(id);
  }

  ngAfterViewInit() {  
    setTimeout(() => {
      const firstElem = document.getElementById('btnBack_Movie_detail'+this.uniquePageId);
      if(firstElem){
        firstElem.focus();
      }      
    }, 1000);
  }
  async onGetMovieDetail() {
    (await this.movieService.getMovieDetail(this.movieId)).subscribe(async response => {
      if (response.status.toLowerCase() === 'success' && response.statusCode == 200) {
        this.getMovieCast();
        response.data.effectiveDate = new Date(response.data.effectiveDate);
        this.movieDetails = response.data;
        response = null;
        await this.orchService.movieOrchestrate(this.movieDetails);

        //trnslate the movie content
        this.userService.syncDynamicTranslation('movie', 'movieId', ''+this.movieId);

        //console.log(JSON.stringify(this.movieDetails));

        //update movie title, descr meta
        this.seoService.updateTitle('Movie: ' + this.movieDetails.moviename + ' | VRNA Plex');
        this.seoService.updateDescription(this.movieDetails.description);
        this.seoService.updateCustomMetaTag('title', 'Movie: ' + this.movieDetails.moviename + ' | VRNA Plex');

        this.seoService.updateCustomMetaTag('og:url', environment.baseUrl+'/#/movie/'+this.movieDetails.movieId);
        this.seoService.updateCustomMetaTag('og:type', 'movie');
        this.seoService.updateCustomMetaTag('og:title', 'Movie: ' + this.movieDetails.moviename + ' | VRNA Plex');   
        this.seoService.updateCustomMetaTag('og:description', this.movieDetails.description);
        this.seoService.updateCustomMetaTag('og:image', this.movieDetails.moviebannerurl); 
        this.seoService.updateCanonicalLink(environment.baseUrl+'/#/movie/'+this.movieDetails.movieId);   
     
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
      //put it here
      setTimeout(() => {
        const firstElem = document.getElementById('btnBack');
        if(firstElem){
          firstElem.focus();
        }      
      }, 500);       
      
      this.chRef.detectChanges();
    });
  }


  async getMovieCast() {
    (await this.movieService.getMovieCasts(this.movieId)).subscribe(async response => {
      if (response.status.toLowerCase() === 'success' && response.statusCode == 200) {
        this.casts = response.data;
        response = null; 
        this.casts.map(cast => cast['imageUrl'] = this.domainUrl + '/images' + cast.imageUrl)
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
      this.chRef.detectChanges();
    });
  }

  async getSuggestions() {

    (await this.movieService.getRelatedSuggestion(this.movieId)).subscribe(async response => {
      if (response.status.toLowerCase() === 'success' && response.statusCode == 200) {
        this.suggestions = response.data;
        this.suggestions = this.suggestions.slice(0, 10);
        response = null; //clearing memory garbage
        this.suggestions.map(cast => cast['posterurl'] = this.domainUrl + '/images' + cast.posterurl)
        this.isLoading = false;
      } else {
        this.isLoading = false;
        if(response.status == 'ERROR'){
        }
      }
      this.chRef.detectChanges();
      this.suggestionOptions_loading = false;
    });
  }

  async onRentContent(data: any) {
    const selectedCountry = await Storage.get({ key: COUNTRY_KEY });
    const selectedCurrency = await Storage.get({ key: CURRENCY_KEY });
  
    if (!selectedCountry || !selectedCountry.value || !selectedCurrency || !selectedCurrency.value) {

      const modal = await this.modalController.create({
        component: LocationComponent,
        cssClass: 'location-modal',
        componentProps: {
          rentalData: data, 
        },
      });
      await modal.present();
    
      const { data: selectedLocation, role } = await modal.onDidDismiss();
      if (role !== 'cancel' && selectedLocation) {
        data.location = selectedLocation;
        await this.rentService.onRent(data);
      }
    } else {
      data.location = selectedCountry.value;
      this.currency = selectedCurrency.value;
      await this.rentService.onRent(data);  
    }
  }
  
  dismiss() {

    //check if user is logged in
    if(isNaN(this.userId) || this.userId == null){
      this.router.navigate(['/auth/login']);
      return false;
    }

    //unsubscribe dynamic translator
    this.eventsService.unsubscribe('i18n:dynamic_movie_' + this.movieId);

    this.modalController.dismiss({
      'dismissed': true
    });
    this.chRef.detectChanges();
  }

  async shareUs() {

    await Share.share({
      title: 'VRNA',
      text: 'New way of Streaming',
      url: this.router.url,
      dialogTitle: 'Share with buddies',
    });
  }

  //for social share
  async showShareOptions() { 
    const modal = await this.modalCtrl.create({
      component: SocialShareComponent,
      componentProps: {
        movieId: this.movieId,
      },
      cssClass: 'backTransparent',
      backdropDismiss: true,      
    });
    return modal.present();
  }

  onSubmit(isRented) {

    //if no login session, then show an alert and return;
    if(isNaN(this.userId) || this.userId == null){
      this.errorService.showAlertMessage('Login Required!', 'Please login to continue.');
      return false;
    }


    if (isRented) {
      this.player.playMovie(this.movieDetails, false);
    } else {
      this.onRentContent(this.movieDetails);
    }
  }

  async onCastDetail(cast) {
    const modal = await this.modalController.create({
      component: CastDetailsPage,
      cssClass: 'movie-details-modal',
      componentProps: {
        'cast': cast,
      }
    });
    await modal.present();

    // const { role } = await modal.onDidDismiss();
    // console.log('onDidDismiss resolved with role', role);
  }

  /*  New */

  async getWishListStatus() {

    //check if user is logged in
    if(isNaN(this.userId) || this.userId == null){
      return false;
    }

    this.loading = true;
    (await this.wishListService.getWishListStatus(this.movieId)).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          if (res.data == true) {
            this.inWishList = true;
          } else {
            this.inWishList = false;
          }
          console.log("isWishlistisWishlistisWishlistisWishlistisWishlistisWishlist>>>>"+this.inWishList);
        } else {
          // this.toast.onFail('Error in response');
        }
        this.loading = false;
      }, (err) => {
        // this.toast.onFail('Error in network');
        this.loading = false;
      }
    )
  }

  async getBlockedStatus() {

    //check if user is logged in
    if(isNaN(this.userId) || this.userId == null){
      return false;
    }

    this.loading = true;
    (await this.wishListService.getBlockedStatus(this.movieId)).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          if (res.data == true) {
            this.isBlocked = true;
          } else {
            this.isBlocked = false;
          }
          console.log("isBlockedisBlockedisBlockedisBlockedisBlockedisBlockedisBlockedisBlocked>>>>"+this.isBlocked);
        } else {
          // this.toast.onFail('Error in response');
        }
        this.loading = false;
      }, (err) => {
        // this.toast.onFail('Error in network');
        this.loading = false;
      }
    )
  }

  async getLikeStatus() {

    //check if user is logged in
    if(isNaN(this.userId) || this.userId == null){
      return false;
    }

    this.loading = true;
    (await this.wishListService.getLikeStatus(this.movieId)).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          if (res.data == true) {
            this.isLiked = true;
          } else {
            this.isLiked = false;
          }
          console.log("isLikedisLikedisLikedisLikedisLikedisLikedisLikedisLikedisLiked>>>>"+this.isLiked);
        } else {        
        }
        this.loading = false;
      }, (err) => {        
        this.loading = false;
      }
    )
  }

  async addToWishList() {
    
    //if no login session, then show an alert and return;
    if(isNaN(this.userId) || this.userId == null){
      this.errorService.showAlertMessage('Login Required!', 'Please login to continue.');
      return false;
    }

    const data = {
      movieId: this.movieId,
      userId: this.userId
    };
    if (!this.inWishList) {      
      (await this.wishListService.addToWishList(data)).subscribe(
        (res: any) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
            this.toast.wPopup('Movie successfully added to WishList');
            this.inWishList = true;
            //this.favorite.setFavorite_update('1');
            this.wishIcon = 'checkmark-outline';
            this.reloadHomeData();
          }
          //this.loading = false;
        }, (err) => {
          // this.toast.onFail('Error in network');
          //this.loading = false;
        }
      )
    } else {
      (await this.wishListService.removeFromWishList(data)).subscribe(
        (res: any) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
            this.toast.wPopup('Movie is removed from WishList');
            this.wishIcon = 'add-outline';
            this.inWishList = false;
            //this.favorite.setFavorite_update('0');
            this.reloadHomeData();
          }
          //this.loading = false;
        }, (err) => {
          // this.toast.onFail('Error in network');
          //this.loading = false;
        }
      )
    }
  }

  async likestatus(status) {

    //if no login session, then show an alert and return;
    if(isNaN(this.userId) || this.userId == null){
      this.errorService.showAlertMessage('Login Required!', 'Please login to continue.');
      return false;
    }
    
    //this.loading = true;
    const data = {
      movieId: this.movieId,
      userId: this.userId,
      likedStatus: status      
    };

    if (!this.isLiked) {      
      (await this.wishListService.addLikes(data)).subscribe(
        (res: any) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
            //this.toast.wPopup('Movie successfully added to favourites');
            this.isLiked = true;
            //this.favorite.setFavorite_update('1');
            //this.favIcon = 'heart';
            this.reloadHomeData();
          }
          //this.loading = false;
        }, (err) => {
          // this.toast.onFail('Error in network');
          //this.loading = false;
        }
      )
    } else {
      (await this.wishListService.removeLikes(data)).subscribe(
        (res: any) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
            // this.toast.wPopup('Movie is removed from favourites');
            //this.favIcon = 'heart-outline';
            this.isLiked = false;
            //this.favorite.setFavorite_update('0');
            this.reloadHomeData();
          }
          //this.loading = false;
        }, (err) => {
          // this.toast.onFail('Error in network');
          //this.loading = false;
        }
      )
    }
  } 

  async blockMovie() {

    //if no login session, then show an alert and return;
    if(isNaN(this.userId) || this.userId == null){
      this.errorService.showAlertMessage('Login Required!', 'Please login to continue.');
      return false;
    }

    //this.loading = true;
    const data = {
      movieId: this.movieId,
      userId: this.userId,
      likedStatus: status      
    };

    if (!this.isBlocked) {      
      (await this.wishListService.addBlock(data)).subscribe(
        (res: any) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
            this.toast.wPopup('this movie is blocked for you');
            this.isLiked = true;
            //this.favorite.setFavorite_update('1');
            //this.favIcon = 'heart';
            this.reloadHomeData();
          }
          //this.loading = false;
        }, (err) => {
          // this.toast.onFail('Error in network');
          //this.loading = false;
        }
      )
    } else {
      (await this.wishListService.removeBlock(data)).subscribe(
        (res: any) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
            this.toast.wPopup('block removed for you');
            //this.favIcon = 'heart-outline';
            this.isLiked = false;
            //this.favorite.setFavorite_update('0');
            this.reloadHomeData();
          }
          //this.loading = false;
        }, (err) => {
          // this.toast.onFail('Error in network');
          //this.loading = false;
        }
      )
    }
  } 
  

  async openIonModal(genre) {

    if(isNaN(this.userId) || this.userId == null){
      this.errorService.showAlertMessage('Login Required!', 'Please login to continue.');
      return false;
    }
    
    let modal: any;
    try{
      console.log(genre);
      const data = {
        genreId: genre,
        userId: this.userId
      };

      modal = await this.modalController.create({
        component: FilterDetailsPage,
        cssClass: 'filtered-pop',
        componentProps: {
          'model_title':  this.getGenreDesc(genre),
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

  reloadHomeData() {
    this.wishListService.getWishList();
  }

  ngOnDestroy() {
    this.suggestions = null;
    this.casts = null;
    this.movieDetails = null;

    this.eventsService.unsubscribe('i18n:dynamic_movie_' + this.movieId);    
    
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    
    /*
      //dont unsubscribe hooks
      this.rentedDataService.rentedMoviesList$?.unsubscribe();
    */
  }

  focus(elem:any){
    document.getElementById(elem).style.border = "solid 0px #dadde0";
  }

  unFocus(elem:any){
    document.getElementById(elem).style.border = "solid 0px rgba(218,218,218,1)";
  }
}
