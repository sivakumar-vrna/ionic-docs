import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatform, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { environment } from 'src/environments/environment';
import { MovieService } from '../../services/movie/movie.service';
import { OrchService } from '../../services/ui-orchestration/orch.service';
import { MovieDetailsService } from '../movie-details/movie-details.service';
import { random } from 'nanoid';
import {EventsService} from 'src/app/shared/services/events.service';
import { UserService } from 'src/app//shared/services/user.service';


@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.page.html',
  styleUrls: ['./view-category.page.scss'],
})
export class ViewCategoryPage implements OnInit, OnDestroy {

  contentData: any;
  category: string;
  domainUrl: string;
  routeSub: Subscription;
  contentData_loading: boolean = true;
  contentData_empty: boolean = false;
  Cnt_Index:string;
  uniquePageId: any;

  public i18n_PageLabels = {
    catpage_featured_title: 'Featured',
    catpage_rented_title: 'Rented',
    catpage_watchlist_title: 'Watchlist',
    catpage_latest_title: 'Latest',
    catpage_trending_title: 'Trending',    
    catpage_top_title: 'Top',
    catpage_recommended_title: 'Recommended',
  }
  public i18n_PageLabels_temp: any;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    public modalController: ModalController,
    private movieDetailService: MovieDetailsService,
    private orchService: OrchService,
    private chRef: ChangeDetectorRef,
    public eventsService: EventsService,
    private userService: UserService

  ) {

    this.i18n_PageLabels_temp = JSON.parse(JSON.stringify(this.i18n_PageLabels));

    this.eventsService.subscribe('i18n:layout', (locale) => {      
      this.userService.translateLayout(this.i18n_PageLabels, this.i18n_PageLabels_temp, 
        locale);      
    });
    
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
      this.domainUrl = (window as any).location.origin;
    }
  }


  keypressOnCnt(event:KeyboardEvent,category_index:number, uniquePageId:any):void{
    let elem: any;
    if (event.key === 'ArrowRight') {  
      const contentDataLength = this.contentData.length;
      if(category_index == contentDataLength-1){
        category_index = -1;
      }      
      elem = document.getElementById('Cnt_Index-' + (category_index + 1)+'_'+uniquePageId);
    }else if (event.key === 'ArrowLeft') {
      elem = document.getElementById('Cnt_Index-' + (category_index - 1)+'_'+uniquePageId);
      if(!elem){
        elem = document.getElementById('btnBackCategory_'+this.uniquePageId);
      }
    }else if(event.key === 'ArrowUp'){
      if(category_index == 0 || category_index == 1){
        elem = document.getElementById('btnBackCategory_'+this.uniquePageId);
      } 
    }
    if (elem) {
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }

  keypressOnbtn(event: KeyboardEvent): void {
    let elem: any;
    if (event.key === 'ArrowRight') {
      elem = document.getElementById('btnMenuCategory_'+this.uniquePageId);
    }
    if (elem) {
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
    // for future purpose
    // if(event.key == 'Enter'){
    //   setTimeout(() => {
    //     let elem = document.getElementById('bannerMain');
    //     if (elem) {
    //       event.stopPropagation();
    //       elem.focus();
    //       event.preventDefault();
    //     }
    //   }, 600); 
    // }
  }

  keypressOnbtnMenu(event:KeyboardEvent):void{
    let elem :any
    if (event.key === 'ArrowLeft'){
      elem = document.getElementById('btnBackCategory_'+this.uniquePageId);
    }
    if (elem) {
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }
  

  ngOnInit() {

    


    console.time('Perf: ViewCategory Screen');
    this.getCategoryData(this.category);
    this.chRef.detectChanges();

    this.uniquePageId = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

    console.log(this.uniquePageId);

  }

  ngAfterViewInit() {
    this.chRef.detectChanges();

    let user_locale = environment.user_locale;  
    this.userService.translateLayout(this.i18n_PageLabels, this.i18n_PageLabels_temp, 
        user_locale);


    console.timeEnd('Perf: ViewCategory Screen');
  }

  async getCategoryData(category) {
    (await this.movieService.getMenuContent(category)).subscribe(async res => {
      if (res.status.toLowerCase() === 'success' && res.statusCode === '200') {
        const tempData = res.data;        
        this.contentData = this.orchService.orchestrateData(tempData);
        res = null; 
        this.chRef.detectChanges();
        if(this.contentData){ }else{
          this.contentData_empty = true;
        }        
      }
      this.contentData_loading = false;

      setTimeout(() => {
        const elem = document.getElementById('Cnt_Index-0_'+this.uniquePageId);
        if(elem){
          elem.focus();
        }else{
          let firstElem= document.getElementById('btnBackCategory_'+this.uniquePageId);   
          firstElem.focus();
        }          
        this.chRef.detectChanges();
      }, 500);

    })
  }

  ngOnDestroy() {
    this.eventsService.unsubscribe('i18n:layout');

    this.routeSub.unsubscribe();
    this.chRef.detectChanges();

  }
}
