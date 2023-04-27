import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatform, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { environment } from 'src/environments/environment';
import { MovieService } from '../../services/movie/movie.service';
import { OrchService } from '../../services/ui-orchestration/orch.service';
import { MovieDetailsService } from '../movie-details/movie-details.service';

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

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private utilityService: UtilityService,
    public modalController: ModalController,
    private movieDetailService: MovieDetailsService,
    private orchService: OrchService
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

  ngOnInit() {
    this.getCategoryData(this.category);
  }

  async getCategoryData(category) {
    (await this.movieService.getMenuContent(category)).subscribe(async res => {
      console.log(res);
      if (res.status.toLowerCase() === 'success' && res.statusCode === '200') {
        const tempData = res.data;
        this.contentData = this.orchService.orchestrateData(tempData);
        console.log(this.contentData);
      } else {
        console.log('Error')
      }
    })
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
