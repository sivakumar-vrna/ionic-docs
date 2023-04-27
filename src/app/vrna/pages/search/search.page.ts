import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatform, LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { SearchService } from 'src/app/shared/services/search/search.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { environment } from 'src/environments/environment';
import { MovieDetailsService } from '../movie-details/movie-details.service';
import { GENRES_KEY } from '../../services/ui-orchestration/orch.service';

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
  genre: any;
  rating: any;
  timeRange: any;
  @ViewChild('search') search: any;

  constructor(
    private searchService: SearchService,
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    public modalController: ModalController,
    private toast: ToastWidget,
    private movieDetailService: MovieDetailsService
  ) {
    this.route.queryParams.subscribe((params) => {
      const movieId = params.id;
      if (movieId) {
        this.movieDetailService.movieDetailsModal(movieId);
      }
    });
  }

  async ngOnInit() {
    if (isPlatform('capacitor')) {
      this.domainUrl = environment.capaciorUrl;
    } else {
      this.domainUrl = window.location.origin;
    }
    const tempData = await Storage.get({ key: GENRES_KEY });
    this.genres = JSON.parse(tempData.value);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.search.setFocus();
    }, 500);
  }

  fromSearchBar(e: any) {
    const searchKey = e.detail?.value;
    this.searchKey = e.detail?.value;
    this.onSearch(searchKey);
  }

  async onSearch(search: any) {
    this.searchKey = search;
    this.isLoading = true;
    const loading = await this.loadingController.create({
      cssClass: 'search-page-loader',
      message: 'Please wait...',
    });
    await loading.present();
    if (search && search?.length > 0) {
      (await this.searchService.onSearch(this.searchKey)).subscribe(
        async (res: any) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
            this.searchResult = res.data;
            this.searchResult.map(result => result['posterurl'] = this.domainUrl + '/images' + result.posterurl)
          } else {
            this.toast.onFail('Error');
          }
          await loading.dismiss();
          this.isLoading = false;
        },
        (err: any) => {
          this.isLoading = false;
          this.toast.onFail('Network error');
        });
    } else {
      await loading.dismiss();
      this.searchKey = null;
      this.searchResult = null;
    }
  }

  async onSearchSuggest(e: any) {
    const searchKey = e.detail?.value;
    this.searchKey = searchKey;
    if (searchKey && searchKey?.length > 0) {
      (await this.searchService.onSearchSuggest(searchKey)).subscribe(
        res => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
            this.searchSuggest = res.data;
          } else {
            this.toast.onFail('Error');
          }
        },
        (err: any) => {
          this.toast.onFail('Network error');
        });
    } else {
      this.searchSuggest = null;
    }
  }


  async getFilteredItems(action) {
    let params = {}
    if (this.searchKey != null) params['searchKey'] = this.searchKey;
    if (this.rating != null) params['rating'] = this.rating;
    if (this.genre != null) params['genre'] = this.genre;
    if (this.timeRange != null) params['timeRange'] = this.timeRange;
    this.searchService.onSearchfiltered(params).subscribe((res) => {
      this.searchResult = res.data
      this.searchResult.map(result => result['posterurl'] = this.domainUrl + '/images' + result.posterurl)
    })
    console.log(params);
  }
}
