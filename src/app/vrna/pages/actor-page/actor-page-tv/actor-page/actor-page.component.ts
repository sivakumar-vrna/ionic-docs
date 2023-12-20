  import { Component, Input, OnInit, ViewChild } from '@angular/core';
  import { Router } from '@angular/router';
  import { SwiperOptions } from 'swiper';
  import { isPlatform } from '@ionic/core';
  import { environment } from 'src/environments/environment';
  import { CastService } from 'src/app/shared/services/cast/cast.service';
  import { BehaviorSubject, Observable, Subject } from 'rxjs';
  import { VrnaflowService } from 'src/app/shared/services/vrnaflow.service';
  import { ErrorService } from 'src/app/shared/services/error.service';
  import { IonSearchbar } from '@ionic/angular';
  import { ActorPageService } from './actor-page.service';
  import { IonContent } from '@ionic/angular';



  @Component({
    selector: 'app-actor-page',
    templateUrl: './actor-page.component.html',
    styleUrls: ['./actor-page.component.scss'],
  })
  export class ActorPageComponent implements OnInit {
    cast: any;
    castData: any; 
    castDataArray: any[] = []; 
    isActorPage: boolean = true;
    castMoviesData: any;
    domainUrl: string;
    featuredCastData$: Observable<any>;
    featuredCastData = new BehaviorSubject<any[]>([]); 
    castData_loading: boolean = true;
    uniquePageId: any;
    filteredActors: any[] = [];
    searchInput: string = '';



    
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
    
    constructor(
      private router: Router,
      private castMovies: CastService,
      private vrnaflowService: VrnaflowService,
      private errorService: ErrorService,
      private actorService:ActorPageService
      ) {}

      @ViewChild('Actor_page_search') Actor_page_search: IonSearchbar;
      @ViewChild(IonContent, { static: false }) ionContent: IonContent;


    
      KeypressOnSearchBtn(event:KeyboardEvent):void{
        let elem:any;
        if(event.key == 'ArrowLeft'){
          elem = document.getElementById('actors_icon');
          elem.focus();
          event.preventDefault();
        } 
        if(event.key == 'ArrowDown'){
          elem = document.getElementById('actor_img');
        }
        if(event.key == 'ArrowRight'){
          event.stopPropagation();
          event.preventDefault();
        } 
        
        if(elem){
          event.stopPropagation();
          elem.focus();
          event.preventDefault();
        }
      }

      keypressActorImg(event: KeyboardEvent): void {
        let elem: HTMLElement | null = null;
        if (event.key === 'ArrowUp') {
          elem = document.getElementById('actors_name');
          elem.focus();
          this.Actor_page_search.setFocus();
          event.preventDefault();
        } else if (event.key === 'ArrowLeft') {
          elem = document.getElementById('actors_icon');
        } else if (event.key === 'ArrowRight') {
          elem = document.getElementById('actor_des');
          elem.focus();
          event.preventDefault();
        } else if (event.key === 'ArrowDown') {
          elem = document.getElementById('related_cast_movies'+'_carouselSwiper_0');
        }

        if (elem) {
          event.stopPropagation();
          if (event.key === 'ArrowDown'){
            elem.click();
          }else{
            elem.focus();
          }
          event.preventDefault();
        }
      }
      keypressActordes(event: KeyboardEvent): void {
        let description = document.querySelector('.description') as HTMLElement;
        const scrollAmount = 20;
        if (event.key === 'ArrowUp') {
          description.scrollBy(0, -scrollAmount);
          description.focus();
          event.preventDefault();
        }
        if(!description){
          this.Actor_page_search.setFocus();
        }
        
        if (event.key === 'ArrowDown') {
          const reachedEnd = description.scrollTop + description.clientHeight >= description.scrollHeight;
      
          if (!reachedEnd) {
            description.scrollTop += scrollAmount;
            description.focus();
            event.preventDefault();
          } else {
            description.focus();
            event.preventDefault();
          }
        }
        if(event.key == 'ArrowLeft'){
          description = document.getElementById('actor_img');
        }
        if(event.key == 'ArrowRight'){
          event.stopPropagation();
          event.preventDefault();
        }


        if(description){
          event.stopPropagation();
          description.focus();
          event.preventDefault();
        }
      }
      
      keypressOnRelated_cast(event:KeyboardEvent):void{
      let elem:any;
      if(event.key == 'ArrowUp'){
        elem = document.getElementById('actors_name');
        elem.focus();
        elem = document.getElementById('actor_img');
        event.preventDefault();
      }
      
      if(event.key == 'ArrowDown'){
        event.stopPropagation();
        event.preventDefault();
      }
      if(event.key == 'ArrowLeft'){
        elem = document.getElementById('actors_icon');
      }

      if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }
    }

      
    async ngOnInit() {

      this.featuredCastData$ = this.featuredCastData.asObservable();
      this.getFeaturedCast();
      this.fetchData();

      if (isPlatform('capacitor')) {
        this.domainUrl = environment.capaciorUrl;
      } else {
        this.domainUrl = window.location.origin;
      }

      if (this.castData && this.castData.castId) {
        (await this.castMovies.onCastMovies(this.castData.castId)).subscribe(res => {
          if (res.status.toLowerCase() === 'success' && res.statusCode === '200') {
            const tempData: any = res.data;
            tempData['tempData'] = this.domainUrl + '/images' + tempData.tempData;
            this.castMoviesData = tempData;
            this.castMoviesData.map(cast => cast['posterurl'] = this.domainUrl + '/images' + cast.posterurl);
          }
        });
      }
    }

    ngAfterViewInit() {
      this.actorService.setSearchbarRef(this.Actor_page_search);

      setTimeout(() => {
        if (this.Actor_page_search) {
          this.Actor_page_search.setFocus();
        }
      },1500);
    }
  
    fetchData() {
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras && navigation.extras.state) {
        const castData = navigation.extras.state.castData;
        if (Array.isArray(castData)) {
          this.castDataArray = castData;
        } else if (castData) {
          this.castData = castData; 
          this.castDataArray = [castData];
        }
      }
    }

    async getFeaturedCast() {
      this.castData_loading = true;

      (await this.vrnaflowService.featuredCast() ).subscribe(
          (res: any) => {
              if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
                  let tempData = res.data;
                  tempData.map(castmap => {
                  castmap['imageUrl'] = environment.cloudflareUrl + castmap.imageUrl;
                  });
                  this.featuredCastData.next(tempData);    
                  this.castData_loading = false; 
                  tempData = null;

              } else {
                  this.errorService.onError(res);
              }
              res = null;
          },
          (err) => {
              this.errorService.onError(err);
          }
        );
      }

      onSearchInputChange(event: any) {
      const userInput = event.target.value.trim().toLowerCase(); 
      console.log('User Input:', userInput); // Log the user input

      if (userInput) {
        this.filteredActors = this.castDataArray.filter((actor) =>
          actor.castname.toLowerCase().includes(userInput)
        );
        console.log('Filtered Actors:', this.filteredActors); // Log the filtered actors
      } else {
        this.filteredActors = this.castDataArray.slice(); // Reset to show all actors if input is empty
        console.log('All Actors:', this.filteredActors); // Log all actors when input is empty
      }
    }

      

    FirstWord(fullName: string): string {
      return fullName.split(' ')[0]; 
    }
    
    LastWords(fullName: string): string {
      const words = fullName.split(' ');
      words.shift(); 
      return words.join(' ');
    }
  }
