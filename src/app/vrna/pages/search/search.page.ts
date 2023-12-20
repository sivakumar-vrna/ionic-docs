import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatform, LoadingController, ModalController, IonSelect } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { SearchService } from 'src/app/shared/services/search/search.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { environment } from 'src/environments/environment';
import { MovieDetailsService } from '../movie-details/movie-details.service';
import { GENRES_KEY } from '../../services/ui-orchestration/orch.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, AfterViewInit {
  searchResult: any;
  searchKey: string;
  searchSuggest: any;
  isLoading = false;
  domainUrl: string;
  genres: any;
  genre: string = '';
  rating: string = ''; 
  timeRange: string = '';
  maturity: string = ''; 
  queryParams: any = {};    
  search_loading: boolean = false;
  selectedIndex: number;
  classNameOfSearchClear: any;
 



  constructor(
    private searchService: SearchService,
    public  loadingController: LoadingController,
    private route: ActivatedRoute,
    public  modalController: ModalController,
    private toast: ToastWidget,
    private movieDetailService: MovieDetailsService,
    private chRef: ChangeDetectorRef,
    private utilityService: UtilityService,
    private renderer: Renderer2

  ) {
    this.route.queryParams.subscribe((params) => {
      const movieId = params.id;
      if (movieId) {
        this.movieDetailService.movieDetailsModal(movieId);
      }
    });
  }

  @ViewChild('genreSelect') genreSelect: IonSelect;
  @ViewChild('search') search: IonSearchbar;



  
  keypressOnBackBtn(event: KeyboardEvent): void {
    if (event.key == 'ArrowRight') {
      const elem = document.getElementById('back_btn');
      if (elem) {
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }
    } else if (event.key == 'ArrowDown') {
      this.search.setFocus();
      event.stopPropagation();
      event.preventDefault();
    }else if(event.key == 'Enter'){
        setTimeout(() => {
          let elem = document.getElementById('Searhicon_home');
          if (elem) {
            event.stopPropagation();
            elem.focus();
            event.preventDefault();
          }
        }, 600); 
      }
  }
  keypressOnMenuBtn(event: KeyboardEvent): void {
    let elem:any;

    if(event.key == 'ArrowLeft'){
      elem=document.getElementById('btnBack');
    }
    if (event.key == 'ArrowDown'){
      event.stopPropagation();
      event.preventDefault();
    }
    if(event.key =='Enter'){
      elem = document.getElementById('btnMenu');
      elem.click();
   }
    
    if (elem) {
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }
  }


  


  keypressOnKeywordInput(event: KeyboardEvent): void {    
    let elem: any;
    if(event.key == 'ArrowDown'){     
      event.stopPropagation();
      const elemGenre = document.getElementById('elemGenre');
      if (elemGenre) {
        elemGenre.focus();
        elemGenre.classList.add('highlighted'); 
      }      
      event.preventDefault();
      elemGenre.addEventListener('blur', () => {
      elemGenre.classList.remove('highlighted'); 
    });
    }else if(event.key == 'ArrowRight'){
      event.stopPropagation();

      let elem: any;
      
      /*
      elem = document.getElementById('idSearchClearInline');
      let elems = document.getElementsByClassName('searchbar-clear-icon');
      elem = elems[0];

      if(elem){
        let elem_visibility = !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
        if(!elem_visibility){
          elem = document.getElementById('elemSearch');
        }
      }
      */     

      if (!elem){            
        elem = document.getElementById('elemSearch');
      }
      elem.focus();
      event.preventDefault();      
    }else if(event.key == 'ArrowLeft'){
      event.stopPropagation();
    }else if(event.key == 'ArrowUp'){
      event.stopPropagation();
      elem = document.getElementById('btnBack');
      elem.focus();
      event.preventDefault();          
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
    
  }

  onBlurInput(): void {
    let elem = document.getElementsByClassName('searchbar-clear-button')[0] as HTMLElement;
    elem.id = "idSearchClearInline";
    elem.className = elem.className+' arrow-navigable';
    elem.tabIndex = 0;
  }


  keypressOnSeach(event: KeyboardEvent): void {  
    if (event.key == 'ArrowDown') {
      event.stopPropagation();
      const elemGenre = document.getElementById('elemGenre');
      if (elemGenre) {
        elemGenre.focus();
        elemGenre.classList.add('highlighted'); 
      }      
      event.preventDefault();
      elemGenre.addEventListener('blur', () => {
      elemGenre.classList.remove('highlighted'); 
    });
    } else if (event.key == 'Enter') {
      event.stopPropagation();
      const elem = document.getElementById('elemSearch');
      elem.click();
      event.preventDefault();
    } else if (event.key == 'ArrowLeft') {
      event.stopPropagation();
      this.search.setFocus();
      event.preventDefault();
    } else if (event.key == 'ArrowRight') {
      event.stopPropagation();
      event.preventDefault();
    }else if (event.key == 'ArrowUp') {
      event.stopPropagation();
      event.preventDefault();
    }
  }
  
    
    keypressOnGenreOpt(event: KeyboardEvent,): void {    
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        const elemGenre = document.getElementById('elemRating');
        if (elemGenre) {
          elemGenre.focus();
          elemGenre.classList.add('highlighted'); 
        }      
        event.preventDefault();
        elemGenre.addEventListener('blur', () => {
        elemGenre.classList.remove('highlighted'); 
      });
      }
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        this.search.setFocus();

      }
      if(event.key == 'Enter'){
        event.stopPropagation();
        let elem = document.getElementById('elemGenre')
        elem.focus();
      }
      if(event.key == 'ArrowDown'){
        event.stopPropagation();
        const elemGenre = document.getElementById('elemMaturity');
        if (elemGenre) {
          elemGenre.focus();
          elemGenre.classList.add('highlighted'); 
        }      
        event.preventDefault();
        elemGenre.addEventListener('blur', () => {
        elemGenre.classList.remove('highlighted'); 
      });
      }
      if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        event.preventDefault();
      }
    }

  
  keypressOnRatingOpt(event: KeyboardEvent): void {    
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      const elemGenre = document.getElementById('elemMaturity');
      if (elemGenre) {
        elemGenre.focus();
        elemGenre.classList.add('highlighted'); 
      }      
      event.preventDefault();
      elemGenre.addEventListener('blur', () => {
      elemGenre.classList.remove('highlighted'); 
    });
    }
    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      const elemGenre = document.getElementById('elemGenre');
      if (elemGenre) {
        elemGenre.focus();
        elemGenre.classList.add('highlighted'); 
      }      
      event.preventDefault();
      elemGenre.addEventListener('blur', () => {
      elemGenre.classList.remove('highlighted'); 
    });
    }
    if(event.key == 'ArrowUp'){
      event.stopPropagation();
      this.search.setFocus();
    }
    if(event.key == 'Enter'){
      event.stopPropagation();
      let elem = document.getElementById('elemRating')
      elem.focus();
    }   
    if(event.key == 'ArrowDown'){
      event.stopPropagation();
      const elemGenre = document.getElementById('elemTimeRange');
      if (elemGenre) {
        elemGenre.focus();
        elemGenre.classList.add('highlighted'); 
      }      
      event.preventDefault();
      elemGenre.addEventListener('blur', () => {
      elemGenre.classList.remove('highlighted'); 
    });
    } 
    
  }


  keypressOnMaturityOpt(event: KeyboardEvent): void {    
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      const elemGenre = document.getElementById('elemTimeRange');
      if (elemGenre) {
        elemGenre.focus();
        elemGenre.classList.add('highlighted'); 
      }      
      event.preventDefault();
      elemGenre.addEventListener('blur', () => {
      elemGenre.classList.remove('highlighted'); 
    });
    }
    if(event.key == 'ArrowUp'){
      event.stopPropagation();
      const elemGenre = document.getElementById('elemGenre');
      if (elemGenre) {
        elemGenre.focus();
        elemGenre.classList.add('highlighted'); 
      }      
      event.preventDefault();
      elemGenre.addEventListener('blur', () => {
      elemGenre.classList.remove('highlighted'); 
    });
    }
    if(event.key == 'Enter'){
      event.stopPropagation();
      let elem = document.getElementById('elemMaturity')
      elem.focus();
    }
    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      const elemGenre = document.getElementById('elemRating');
      if (elemGenre) {
        elemGenre.focus();
        elemGenre.classList.add('highlighted'); 
      }      
      event.preventDefault();
      elemGenre.addEventListener('blur', () => {
      elemGenre.classList.remove('highlighted'); 
    });
    }
  }

  keypressOnTimerangeOpt(event: KeyboardEvent): void {    
    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      const elemGenre = document.getElementById('elemMaturity');
      if (elemGenre) {
        elemGenre.focus();
        elemGenre.classList.add('highlighted'); 
      }      
      event.preventDefault();
      elemGenre.addEventListener('blur', () => {
      elemGenre.classList.remove('highlighted'); 
    });
    }
    if(event.key == 'ArrowUp'){
      event.stopPropagation();
      const elemGenre = document.getElementById('elemRating');
      if (elemGenre) {
        elemGenre.focus();
        elemGenre.classList.add('highlighted'); 
      }      
      event.preventDefault();
      elemGenre.addEventListener('blur', () => {
      elemGenre.classList.remove('highlighted'); 
    });
    }
    if(event.key == 'Enter'){
      event.stopPropagation();
      let elem = document.getElementById('elemTimeRange')
      elem.focus();
    }
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();
    }

  }
    keypressOnBtn(event: KeyboardEvent): void{
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        this.search.setFocus();
      }
      if(event.key == 'Enter'){
        event.stopPropagation();
        let elem = document.getElementById('elembtn')
        elem.click();
      }
      if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        event.preventDefault();
      }
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        event.preventDefault();

      }

  }

  

  async ngOnInit() {
    console.time('Perf: Search Screen');

    if (isPlatform('capacitor')) {
      this.domainUrl = environment.capaciorUrl;
    } else {
      this.domainUrl = (window as any).location.origin;
    }
    const tempData = await Storage.get({ key: GENRES_KEY });
    this.genres = JSON.parse(tempData.value);
    this.genres.sort((a, b) => a.genreDesc.localeCompare(b.genreDesc));
  }  

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.search) {
        this.search.setFocus();
      }
    },1500);
    console.timeEnd('Perf: Search Screen');
  }

fromSearchBar(event: Event) {
    event.preventDefault(); 
    const searchKey = this.search.value;
    if (searchKey && searchKey.trim() !== "") {
      this.searchKey = searchKey;
      this.onSearch(searchKey);
      this.onSearchSuggest(searchKey);
    }
  }
  

  async onSearch(search: any) {
    this.searchKey = search.trim();
    this.isLoading = true;
    this.clearAllFilters();
    this.search_loading = true;

    if (search?.length >=3) {      
      (await this.searchService.onSearch(this.searchKey)).subscribe(
        async (res: any) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {            
            this.searchResult = res.data;
            for (let i = 0; i < this.searchResult.length; i++) {
              const isRented = await this.utilityService.isRented(this.searchResult[i]);
              this.searchResult[i]['isRented'] = isRented;
              this.searchResult[i]['posterurl'] = this.domainUrl + '/images' + this.searchResult[i].posterurl;
            }
            res = null; //garbage memory
            this.chRef.detectChanges();           

            //dpad focus on the first result card
            let elem = document.getElementById('search_result-0');
            if(elem){
              elem.focus();
            }

          } else {
            
          }
          this.search_loading = false;
          this.isLoading = false;
        },
        (err: any) => {
          this.isLoading = false;
          // this.toast.onFail('Network error');
        }
      );
    } else {
      //this.toast.wPopup('type atleast 4 characters');
      this.search_loading = false;
      this.searchKey = null;
      this.searchResult = null;
    }
  }

  async onSearchSuggest(search: any) {    
    const searchKey = search.trim();
    //const searchKey = e.detail?.value;
    //this.searchKey = searchKey;
    if (searchKey && searchKey?.length >=3) {
      (await this.searchService.onSearchSuggest(searchKey)).subscribe(
        (res) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {            
            this.searchSuggest = res.data;
          } else {
            
          }

          res = null; //garbage memory

          this.chRef.detectChanges();
        },
        (err: any) => {
          // this.toast.onFail('Network error');
        }
      );
    } else {
      this.toast.wPopup('Please provide keywords greater than or equal to 3 letters.');
      this.searchSuggest = null;
    }
  }
  
  async getFilteredItems(element: any, elementname: any) {
    this.queryParams = {};    
    console.log(this.searchKey);
    if (this.search.value !=='' || this.searchResult) {          
      console.log("going in");
      if (this.searchKey) {this.queryParams['searchKey'] = this.searchKey.trim();}
      if (this.genre) {this.queryParams['genre'] = this.genre;}
      if (this.rating) {this.queryParams['rating'] = this.rating;}
      if (this.timeRange) {this.queryParams['timeRange'] = this.timeRange;}
      if (this.maturity) {this.queryParams['maturity'] = this.maturity;}
      
      console.log(this.queryParams);
      (await this.searchService.onFilteredSearch(this.queryParams)).subscribe(async (res: any) => {
      if (res.data) {
        for (let i = 0; i < res.data.length; i++) {
          const isRented = await this.utilityService.isRented(res.data[i]);
          res.data[i]['isRented'] = isRented;
          res.data[i]['posterurl'] = this.domainUrl + '/images' + res.data[i].posterurl;
        }
        this.searchResult = res.data;
      }
      });      
    }else{      
      this.toast.wPopup("No search result to filter");
    }
  } 
  

  clearAllFilters() {
    this.genre = ''; 
    this.rating = '';  
    this.maturity = ''; 
    this.timeRange = ''; 
    /*this.searchKey = ''; 
    if (this.search) {
      this.search.value = '';
    }*/
    //this.getFilteredItems;
  }
  

  clearSearchResults() {
      this.searchKey = null;    
      this.searchResult = null;
  }
}
