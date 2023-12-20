import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonSearchbar, isPlatform, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MovieService } from 'src/app/vrna/services/movie/movie.service';
import { MovieDetailsService } from '../../../movie-details/movie-details.service';

import { BehaviorSubject, Subject } from 'rxjs';
import { VrnaflowService } from 'src/app/shared/services/vrnaflow.service';
import { OrchService } from 'src/app/vrna/services/ui-orchestration/orch.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { FavoriteMoviesService } from './favorite-movies.service';

@Component({
  selector: 'app-favorite-movies',
  templateUrl: './favorite-movies.component.html',
  styleUrls: ['./favorite-movies.component.scss'],
})
export class FavoriteMoviesComponent implements  OnInit, OnDestroy {

  isLoadingData = true;
  favouritesDataSource: any[] = [];
  favouritesData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  searchQuery: string = '';

  fav_index:string;
  domainUrl: string;
  routeSub: Subscription;
  contentData_loading: boolean = true;
  contentData_empty: boolean = false;
  Cnt_Index:string;
  uniquePageId: any;
  category: string;
  
  constructor(
    private vrnaflowService: VrnaflowService,
    private errorService: ErrorService,
    private movieService: MovieService,
    private route: ActivatedRoute,
    public modalController: ModalController,
    private movieDetailService: MovieDetailsService,
    private orchService: OrchService,
    private chRef: ChangeDetectorRef,
    private favmoviesService:FavoriteMoviesService

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

  @ViewChild('search_fav') search_fav: IonSearchbar;

  KeypressOnSearchBtn(event:KeyboardEvent):void{
    let elem:any;
    if(event.key == 'ArrowLeft'){
      elem= document.getElementById('Favorite_icon');
    } 
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();
    } 
    if(event.key == 'ArrowDown'){
     elem = document.getElementById('fav_index-0_'+this.uniquePageId);
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }
  keypressOnFav(event:KeyboardEvent,favorite_index:number, uniquePageId:any):void{
    let elem: any;
    if (event.key === 'ArrowRight') {  
      const favoriteDataLength = this.favouritesDataSource.length;
      if(favorite_index== favoriteDataLength -1){
        event.stopPropagation();
        event.preventDefault();
        return; 
      }
      elem = document.getElementById('fav_index-' + (favorite_index+ 1)+'_'+uniquePageId);
      if(!elem){
        event.stopPropagation();
        event.preventDefault();
      }
    }else if (event.key === 'ArrowLeft') {
        elem = document.getElementById('fav_index-' + (favorite_index - 1)+'_'+uniquePageId);
        if (favorite_index === 0) {
          const elem = document.getElementById('Favorite_icon');
          if (elem) {
          event.stopPropagation();
          elem.focus();
          event.preventDefault();
        }
      }
    }else if(event.key === 'ArrowUp'){
       if(favorite_index== 0 ||favorite_index == 1){
        this.search_fav.setFocus();
        elem = document.getElementById('fav_cnt');      
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
    this.getFavouriteData();
    this.uniquePageId = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  }
  ngAfterViewInit() {
    this.favmoviesService.setSearchbarRef(this.search_fav);
  }
  
  async getFavouriteData() {
    try {
      const res: any = await (await this.vrnaflowService.getFavourites()).toPromise();

      if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
        let tempData = res.data;
        this.favouritesDataSource = this.orchService.orchestrateData(tempData);
        this.favouritesData.next(tempData); 
        setTimeout(() => {
          const elem = document.getElementById('fav_index-0_'+this.uniquePageId);
          if(elem){
            elem.focus();
          }else{
            if (this.search_fav) {
              this.search_fav.setFocus();
            }
          }          
        }, 1000);
      } else {
        this.errorService.onError(res);
      }
    } catch (err) {
      this.errorService.onError(err);
    } finally {
      this.isLoadingData = false;
    }
  }

  SearchFilter() {
    if (this.searchQuery.trim() !== '') {
      this.isLoadingData = true;
      const originalData = this.favouritesData.getValue(); 
      const filteredMovies = originalData.filter(movie =>
        movie.moviename && movie.moviename.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.favouritesDataSource = filteredMovies;
      this.isLoadingData = false; 
    } else {
      this.isLoadingData = true;
      this.getFavouriteData();
    }
  }
  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.chRef.detectChanges();

  }
  
  }

