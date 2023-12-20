  import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
  import { VrnaflowService } from 'src/app/shared/services/vrnaflow.service';
  import { environment } from 'src/environments/environment';
  import { BehaviorSubject, Observable, Subject } from 'rxjs';
  import { ErrorService } from 'src/app/shared/services/error.service';
  import { map } from 'rxjs/operators';
  import { Router } from '@angular/router';
  import { IonSearchbar } from '@ionic/angular';
  import { AllActorsService } from './all-actors.service';
  
  @Component({
    selector: 'app-all-actors',
    templateUrl: './all-actors.component.html',
    styleUrls: ['./all-actors.component.scss'],
  })
  export class AllActorsComponent implements OnInit {
    @Input() castData: any;
    @Input() domainUrl: string;
    castData_loading: boolean = true;
    searchQuery: string = '';
    featuredCastData$: Observable<any>;
    featuredCastData = new BehaviorSubject<any[]>([]); 
    uniquePageId: any;
    Actors_index:string;

    
    constructor(
      private vrnaflowService: VrnaflowService,
      private errorService: ErrorService,
      private router: Router,
      private allActorsService: AllActorsService
      ) {}

      @ViewChild('search_actors') search_actors: IonSearchbar;
      
      KeypressOnSearchBtn(event:KeyboardEvent):void{
        let elem:any;
        if(event.key == 'ArrowLeft'){
          elem= document.getElementById('actors_icon');
        } 
        if(event.key == 'ArrowRight'){
          event.stopPropagation();
          event.preventDefault();
        } 
        if(event.key == 'ArrowDown'){
          elem = document.getElementById('Actors_index-0_'+this.uniquePageId);
        }
        if(elem){
          event.stopPropagation();
          elem.focus();
          event.preventDefault();
        }
      }

      keypressOnCast(event: KeyboardEvent, cast_index: number, uniquePageId: any): void {
        let elem: any;
         this.featuredCastData$.subscribe((data) => {
          if (event.key === 'ArrowRight') {
             const homeDataLength = data.length; 
            if (cast_index == homeDataLength-1) {
                event.stopPropagation();
                event.preventDefault();
                return;
            }
            elem = document.getElementById('Actors_index-'+(cast_index+1)+'_'+uniquePageId);
            if(!elem){
              event.stopPropagation();
              event.preventDefault();
            }
          } else if (event.key == 'ArrowLeft') {
            elem = document.getElementById('Actors_index-' + (cast_index - 1) + '_' + uniquePageId);
            if (cast_index === 0) {
              const actorsIconElem = document.getElementById('actors_icon');
              if (actorsIconElem) {
                event.stopPropagation();
                actorsIconElem.focus();
                event.preventDefault();
                return;
              }
            }
          } else if (event.key == 'ArrowUp') {
            if (cast_index === 0 || cast_index === 1 || cast_index === 2 || cast_index === 3) {
              if (this.search_actors) {
                this.search_actors.setFocus();
              }
              elem = document.getElementById('actors_cnt');
              if (elem) {
                elem.focus();
              }
            }
          }
      
          if (elem) {
            event.stopPropagation();
            elem.focus();
            event.preventDefault();
          }
        });
      }
      
     ngOnInit(){
      this.featuredCastData$ = this.featuredCastData.asObservable();
      this.getFeaturedCast();
      this.uniquePageId = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    }

    ngAfterViewInit() {
      this.allActorsService.setSearchbarRef(this.search_actors);
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

                  setTimeout(() => {
                    const elem = document.getElementById('Actors_index-0_'+this.uniquePageId);
                    if(elem){
                      elem.focus();
                    }else{
                      if (this.search_actors) {
                        this.search_actors.setFocus();
                      }
                    }          
                  }, 1000);
            

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

      getArray(length: number): any[] {
        return new Array(length);
      }

      filterCast() {
      
        this.featuredCastData$ = this.featuredCastData.pipe(
          map((castData: any[]) => {
            if (!this.searchQuery.trim()) {
              return castData;
            } else {
              return castData.filter((cast: any) =>
                cast.castname.toLowerCase().startsWith(this.searchQuery.toLowerCase())
              );
            }
          })
        );
      }
      async onCastDetail(cast) {
        if (cast) {
          this.router.navigate(['/actor-page-tv/actor-page'], { state: { castData: cast } });
        }
      }
    }
      
      
      

  
