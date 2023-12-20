import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { isPlatform, ModalController } from '@ionic/angular';
import { SearchService } from 'src/app/shared/services/search/search.service';
import { environment } from 'src/environments/environment';
import videojs from 'video.js';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'app-filter-details',
    templateUrl: './filter-details.page.html',
    styleUrls: ['./filter-details.page.scss'],
})
export class FilterDetailsPage implements OnInit {
    @Input() model_title: string;
    @Input() data: any;
    @Input() type: any;
    searchResult: any;
    domainUrl: any;
    api_call_completed: boolean = false;
    searchResult_empty: boolean = false;
    filter_genre:string;
    uniquePageId:any;
    

    constructor(
        private modalController: ModalController, private searchService: SearchService,
        private chRef: ChangeDetectorRef, private userService: UserService,
    ) { } 
    
    
    keypressOnGenre(event: KeyboardEvent, filter_genreindex: number, uniquePageId: any): void {
      let elem: any;
      if (event.key === 'ArrowRight') {  
        const searchResultLength = this.searchResult.length;
        if(filter_genreindex == searchResultLength-1){
          filter_genreindex = -1;
        }      
        elem = document.getElementById('filter_genre-' + (filter_genreindex + 1)+'_'+uniquePageId);
        }else if (event.key === 'ArrowLeft') {
        elem = document.getElementById('filter_genre-' + (filter_genreindex - 1)+'_'+uniquePageId);
        if(!elem){
          elem = document.getElementById('backbtn_'+ this.uniquePageId);
        }
      } else if(event.key === 'ArrowUp'){
        if(filter_genreindex == 0 || filter_genreindex == 1){
          elem = document.getElementById('backbtn_'+this.uniquePageId);
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
      if (event.key === 'ArrowDown') {
        elem = document.getElementById('filter_genre-0_'+this.uniquePageId);
      }
      if (elem) {
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }
    }
    
    ngOnInit() {
        
      this.uniquePageId = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);


        console.time('Perf: FilterDetails Screen');

        try{

            const players = videojs.getAllPlayers();
            if(players){            
              players.forEach(function (player) {
                if(!player.paused()){
                  player.pause();
                }
              });
            }

        } catch(err){
            alert(err);
        }

        this.chRef.detectChanges();

        if (isPlatform('capacitor')) {
            this.domainUrl = environment.capaciorUrl;
        } else {
            this.domainUrl = (window as any).location.origin;
        }

        this.getFilteredItems();
    }

    ngAfterViewInit() {
      setTimeout(() => {
        const firstElem = document.getElementById('filter_genre-0_'+this.uniquePageId);
        if(firstElem){
          firstElem.focus();
        }
      }, 2000);
        console.timeEnd('Perf: FilterDetails Screen');
    }
       

    async closeModel() {
        const close: string = "Modal Removed";
        await this.modalController.dismiss(close);
    }    

    async getFilteredItems() {
        let params: any = [];

        try{                     

          (await this.searchService.onGenreSearch(this.data.genreId)).subscribe(
            async (res: any) => {
              if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
                this.searchResult = res.data;
                this.searchResult.map(
                  (result) =>
                    (result['posterurl'] =
                      this.domainUrl + '/images' + result.posterurl)
                );

                if(this.searchResult.length == 0){
                  this.searchResult_empty = true;
                }
    
                res = null; //garbage memory
                this.chRef.detectChanges();
                
                const elem = document.getElementById('filter_genre-0_'+this.uniquePageId);
                if(elem){
                  elem.focus();
                }

              } else {
                this.searchResult_empty = true;
                //alert('Error');
              }

              this.api_call_completed = true;                  
            },
            (err: any) => {
              alert(err);
              this.api_call_completed = true;
            }
          );           

        } catch (err){
            alert('err: '+err);
        }        
    }

    dismiss() {

        try{
            this.modalController.dismiss({
              'dismissed': true
            });
        } catch (err){
            console.log(err);
        }


        this.chRef.detectChanges();
    }
}