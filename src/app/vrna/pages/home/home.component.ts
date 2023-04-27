import { AfterViewInit, Component, OnDestroy, OnInit,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { VrnaflowService } from 'src/app/shared/services/vrnaflow.service';
import { MovieDetailsPage } from '../movie-details/movie-details.page';
import { isPlatform } from '@ionic/core';
import { UiRentDataService } from 'src/app/vrna/services/ui-orchestration/ui-rent-data.service';
import { environment } from 'src/environments/environment';
import { HomeService } from './home.service';
import { MovieDetailsService } from '../movie-details/movie-details.service';
import { FilterDetailsPage } from '../filter-details/filter-details.page';
import { HttpClient } from '@angular/common/http';
import { SearchService } from 'src/app/shared/services/search/search.service';
import { LoadingController } from '@ionic/angular';

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
  rentedDataSource: any;
  continueWatchDataSource: any;
  bannerContents: any[] = [];
  homeData: any;
  filteredData: any[];
  home: any;
  displayData: any[];
  carouselLoading = true;




  loadingData = [1, 2, 3, 4, 5, 6, 7];
  featuredCast: any;
  isCapacitor: boolean;
  domainUrl: string;
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
  isLoading: boolean;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public modalController: ModalController,
    private vrnaflowService: VrnaflowService,
    private orchRentService: UiRentDataService,
    private homeService: HomeService,
    private movieService: MovieDetailsService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,

  ) {
    if (isPlatform('capacitor')) {
      this.domainUrl = environment.capaciorUrl;
    } else {
      this.domainUrl = window.location.origin;
    }
    this.triggerHomeData();
    this.route.queryParams.subscribe((params) => {
      const movieId = params.id;
      if (movieId) {
        this.movieService.movieDetailsModal(movieId);
      }
    });
    this.filteredData = [];
    this.homeData = [];
    this.home = {};
    this.getHomeData();

  }

  async ngOnInit() {
    this.generes = JSON.parse(localStorage.getItem('CapacitorStorage.genres'));
    this.isCapacitor = isPlatform('capacitor');
    this.getBannerData();
    this.getContinueWatchData();
    this.getFavouritesData();
    this.getRentedData();
    this.getFeaturedCast();
    this.getHomeData();
    this.orchRentService.userRentedMovies();
    this.displayData = this.home && this.home.data ? [...this.home.data] : [];

    if (isPlatform('capacitor')) {
      this.domainUrl = environment.capaciorUrl;
  } else {
      this.domainUrl = window.location.origin;
  }

  
  }

  ngAfterViewInit() {
    console.log('HOme after view');
  }

  triggerHomeData() {
    this.homeService.getBannerData();
    this.homeService.getContinueWatchData();
    this.homeService.getFavouriteData();
    this.homeService.getRentedData();
    this.homeService.getHomeData();
  }

  getBannerData() {
    this.homeService.bannerData.subscribe((data: any[]) => {
      if (data !== null) {
        this.bannerContents = data;
      } else {
        this.bannerContents = null;
      }
    });
  }

  getContinueWatchData() {
    this.homeService.continueWatchData.subscribe((data) => {
      if (data !== null) {
        this.continueWatchDataSource = data;
      } else {
        this.continueWatchDataSource = null;
      }
    });
  }

  getFavouritesData() {
    this.homeService.favouritesData.subscribe((data) => {
      if (data !== null) {
        this.favouritesDataSource = data;
      } else {
        this.favouritesDataSource = null;
      }
    });
  }

  getRentedData() {
    this.homeService.rentedData.subscribe((data) => {
      if (data !== null) {
        this.rentedDataSource = data;
      } else {
        this.rentedDataSource = null;
      }
    });
  }

   getHomeData() {
    this.homeService.homeData$.subscribe((data) => {
      if (data !== null) {
        this.homeData = data;
      } else {
        this.home = {};
        this.homeData = null;
      }
    });
  }

  

  async getFeaturedCast() {
    (await this.vrnaflowService.featuredCast()).subscribe(res => {
      if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
        this.featuredCast = res.data;
      }
    });
  }

  doRefresh(event) {
    this.homeService.getAllHomeData();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  ngOnDestroy() {
    if (this.homeService.bannerData) {
      this.homeService.bannerData.unsubscribe();
    }
    if (this.homeService.homeData$) {
      this.homeService.homeData$.unsubscribe();
    }
  }

  async openIonModal(data) {
    const modal = await this.modalController.create({
      component: FilterDetailsPage,
      componentProps: {
        'model_title': "Latest Movies",
        'data': data,
        'type': 'genre'
      }
    });
    

    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        // this.modelData = modelData.data;
        console.log('Modal Data : ' + modelData.data);
      }
    });
    return await modal.present();
  }

async filterByGenre(genre: any) {
  const loading = await this.loadingCtrl.create({
    message: 'Loading...',
    spinner: 'bubbles',
    translucent: true,
    cssClass: 'custom-class custom-loading'
  });
  await loading.present();
  try {
    const res = await this.vrnaflowService.getDataByGenre(genre.genreId); 
    res.subscribe((response) => {
      if (response.status && response.status.toLowerCase() === 'success' && response.statusCode == 200) {
        this.filteredData = response.data;

        this.filteredData.forEach((item: any) => {
          item['posterurl'] = this.domainUrl + '/images' + item.posterurl;
        });

        if (this.homeData) {
          this.home = {
            data: this.homeData
          }
          this.displayData = [...this.homeData, ...this.filteredData];
        } else {
          this.displayData = this.filteredData;
        }
      }
      loading.dismiss(); 
    });
  } catch (error) {
    console.error(error);
    loading.dismiss();
  }
}


}
