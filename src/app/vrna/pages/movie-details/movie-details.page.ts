import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { isPlatform, ModalController } from '@ionic/angular';
import { BackgroundColorOptions } from '@capacitor/status-bar';
import { Share } from '@capacitor/share';
import { ActivatedRoute, Router } from '@angular/router';
import { RentService } from 'src/app/components/rent/rent.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Subscription } from 'rxjs';
import { PlayerService } from 'src/app/components/player/service/player.service';
import { MovieService } from '../../services/movie/movie.service';
import { UiRentDataService } from '../../services/ui-orchestration/ui-rent-data.service';
import { DOCUMENT } from '@angular/common';
import { CastDetailsPage } from '../cast-details/cast-details.page';
import { environment } from 'src/environments/environment';
import { SwiperOptions } from 'swiper';
import { OrchService } from '../../services/ui-orchestration/orch.service';

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
  movieDetails: any;
  casts: any;
  isLoading = true;
  routeSub: Subscription;
  suggestions = [];

  // #For Skeleton Loader
  skeletonData = [1, 2, 3, 4, 5, 6];

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
  ) {
    if (isPlatform('capacitor')) {
      this.domainUrl = environment.capaciorUrl;
    } else {
      this.domainUrl = window.location.origin;
    }
    this.routeSub = this.route.params.subscribe(params => {
      this.movieId = params['id']; // Movie id is captured here
    });
  }

  ngOnInit() {
    this.onGetMovieDetail();
  }

  ngAfterViewInit() {
    this.rentedDataService.rentedMoviesList$?.subscribe(async (list: any) => {
      const isRented = await this.utilityService.isRented(this.movieDetails);
      if (this.movieDetails) {
        this.movieDetails['isRented'] = isRented;
      }
    });
    this.getSuggestions();
  }

  async onGetMovieDetail() {
    (await this.movieService.getMovieDetail(this.movieId)).subscribe(async response => {
      if (response.status.toLowerCase() === 'success' && response.statusCode == 200) {
        this.getMovieCast();
        this.movieDetails = response.data;
        await this.orchService.movieOrchestrate(this.movieDetails);
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    });
  }

  async getMovieCast() {
    (await this.movieService.getMovieCasts(this.movieId)).subscribe(async response => {
      if (response.status.toLowerCase() === 'success' && response.statusCode == 200) {
        this.casts = response.data;
        this.casts.map(cast => cast['imageUrl'] = this.domainUrl + '/images' + cast.imageUrl)
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    });
  }

  async getSuggestions() {
    (await this.movieService.getRelatedSuggestion(this.movieId)).subscribe(async response => {
      if (response.status.toLowerCase() === 'success' && response.statusCode == 200) {
        this.suggestions = response.data;
        this.suggestions.map(cast => cast['posterurl'] = this.domainUrl + '/images' + cast.posterurl)
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    });
  }

  async onRentContent(data: any) {
    await this.rentService.onRent(data);
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async shareUs() {

    await Share.share({
      title: 'VRNA',
      text: 'New way of Streaming',
      url: this.router.url,
      dialogTitle: 'Share with buddies',
    });
  }

  onSubmit(isRented) {
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

    const { role } = await modal.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);

  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
