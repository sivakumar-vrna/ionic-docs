import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonSearchbar, isPlatform, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MovieService } from 'src/app/vrna/services/movie/movie.service';
import { MovieDetailsService } from '../../../movie-details/movie-details.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { VrnaflowService } from 'src/app/shared/services/vrnaflow.service';
import { OrchService } from 'src/app/vrna/services/ui-orchestration/orch.service';
import { AllMoviesService } from './all-movies.service';

@Component({
  selector: 'app-all-movies',
  templateUrl: './all-movies.component.html',
  styleUrls: ['./all-movies.component.scss'],
})
export class AllMoviesComponent implements  OnInit, OnDestroy{
  
  isLoadingData = true;
  homeData: any;
  homeData$ = new Subject();
  filteredMovies: any;
  homedata_index:string;

  category: string;
  domainUrl: string;
  routeSub: Subscription;
  contentData_loading: boolean = true;
  contentData_empty: boolean = false;
  uniquePageId: any;
  
  constructor(
    private vrnaflowService: VrnaflowService,
    private errorService: ErrorService,
    private movieService: MovieService,
    private route: ActivatedRoute,
    public  modalController: ModalController,
    private movieDetailService: MovieDetailsService,
    private orchService: OrchService,
    private chRef: ChangeDetectorRef,
    private allMoviesService: AllMoviesService

  ) {
    this.routeSub = this.route.params.subscribe(params => {
      this.category = params['category'];
    });
    this.route.queryParams.subscribe((params) => {
      const movieId = params.id;
      if (movieId) {
        this.movieDetailService.movieDetailsModal(movieId);
      }
    });
    if (isPlatform('capacitor')) {
      this.domainUrl = environment.capaciorUrl;
    } else {
      this.domainUrl = window.location.origin;
    }
  }
  @ViewChild('search_movies') search_movies: IonSearchbar;

  
  KeypressOnSearchBtn(event:KeyboardEvent):void{
    let elem:any;
    if(event.key == 'ArrowLeft'){
      elem= document.getElementById('All_movies');
    } 
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();
    } 
    if(event.key == 'ArrowDown'){
     elem = document.getElementById('homedata_index-0_'+this.uniquePageId);
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }

  keypressOnCnt(event:KeyboardEvent,home_index:number, uniquePageId:any):void{
    let elem: any;
    if (event.key === 'ArrowRight') {  
      const homeDataLength = this.homeData.length;
      if(home_index== homeDataLength-1){
        event.stopPropagation();
        event.preventDefault();
        return; 
      }
      elem = document.getElementById('homedata_index-' + (home_index + 1)+'_'+uniquePageId);
      if(!elem){
        event.stopPropagation();
        event.preventDefault();
      }
     }else if (event.key === 'ArrowLeft') {
        elem = document.getElementById('homedata_index-' + (home_index - 1)+'_'+uniquePageId);
        if (home_index === 0) {
          const elem = document.getElementById('All_movies');
          if (elem) {
          event.stopPropagation();
          elem.focus();
          event.preventDefault();
        }
      }
    }else if(event.key === 'ArrowUp'){
       if(home_index== 0 ||home_index == 1 || home_index== 2 ||home_index == 3){
        this.search_movies.setFocus();
        elem = document.getElementById('movies_cnt');      
        elem.focus();
      }
      
    } 
    if (elem) {
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }
  
  ngOnInit() {
    this.getHomeData();
    this.uniquePageId = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  }

  ngAfterViewInit() {
    this.allMoviesService.setSearchbarRef(this.search_movies);
  }

  
  
  async getHomeData() {
    (await this.vrnaflowService.onLoadHomePage()).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          let tempData = res.data;
          const allMovies: any[] = [];

          Object.keys(tempData).forEach((categoryKey) => {
            const moviesInCategory = tempData[categoryKey];
            allMovies.push(...moviesInCategory);
          });
          const uniqueMovies = this.getUniqueMovies(allMovies, 'movieId');
          
          this.homeData = uniqueMovies;
          this.filteredMovies = uniqueMovies;
          this.dataConstruction(tempData);
          console.log(this.homeData);
          this.isLoadingData = false;

          setTimeout(() => {
            const elem = document.getElementById('homedata_index-0_'+this.uniquePageId);
            if(elem){
              elem.focus();
            }else{
              if (this.search_movies) {
                this.search_movies.setFocus();
              }
            }          
          }, 1000);
    
        } else {
          this.errorService.onError(res);
        }
      },
      (err) => {
        this.errorService.onError(err);
      }
    );
  }

  getUniqueMovies(movies: any[], uniqueProperty: string): any[] {
    const uniqueMovieMap = new Map();
    movies.forEach((movie) => {
      if (!uniqueMovieMap.has(movie[uniqueProperty])) {
        uniqueMovieMap.set(movie[uniqueProperty], movie);
      }
    });
    return Array.from(uniqueMovieMap.values());
  }

  dataConstruction(data: any) {
    let tempHomedata = [];
    Object.keys(data).forEach(key => {
        let tempData = {
            title: key,
            data: this.orchService.orchestrateData(data[key])
        };
        tempHomedata.push(tempData);
        tempData = null;
    });
    this.homeData$.next(tempHomedata);
    tempHomedata = null;
}

onSearch(event: any) {
  const searchTerm = event.detail.value.toLowerCase().trim();
  if (this.filteredMovies && this.filteredMovies.length > 0) {
    this.homeData = this.filteredMovies.filter((movie: any) => {
      return movie.moviename && movie.moviename.toLowerCase().includes(searchTerm);
    });
  } else {
    this.homeData = this.filteredMovies || [];
  }
}



ngOnDestroy() {
  this.routeSub.unsubscribe();
  this.chRef.detectChanges();

}

  
}
