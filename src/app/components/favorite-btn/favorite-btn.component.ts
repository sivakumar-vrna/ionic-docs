import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { HomeService } from 'src/app/vrna/pages/home/home.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { FavoriteService } from './favorite.service';
import { ErrorService } from 'src/app/shared/services/error.service';

@Component({
  selector: 'app-favorite-btn',
  templateUrl: './favorite-btn.component.html',
  styleUrls: ['./favorite-btn.component.scss'],
})
export class FavoriteBtnComponent implements OnInit {

  @Input() movieId: number;
  @Input() userId: number;
  @Input() uniquePageId:any;
  @Input() btnDesc:any;

  isFavorite: boolean = false;
  favIcon = 'heart';
  loading = false;

  constructor(
    private favorite: FavoriteService,
    private userService: UserService,
    private toast: ToastWidget,
    private homeService: HomeService,
    private errorService: ErrorService
  ) { }

  async ngOnInit() {
    console.time('Perf: CompnFavoriteBtn Screen');

    this.userId = await this.userService.getUserId();
    await this.getFavoriteStatus();
  }

  ngAfterViewInit() {
    console.timeEnd('Perf: CompnFavoriteBtn Screen');
  }

  async getFavoriteStatus() {

    //for guest users
    if(isNaN(this.userId) || this.userId == null){
      return false;
    }

    this.loading = true;
    (await this.favorite.getFavorite(this.userId, this.movieId)).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          if (res.data?.movieId == this.movieId) {
            this.isFavorite = true;
            this.favIcon = 'heart';
          } else {
            this.isFavorite = false;
            this.favIcon = 'heart-outline';
          }
        } else {
          // this.toast.onFail('Error in response');
        }
        this.loading = false;
      }, (err) => {
        // this.toast.onFail('Error in network');
        this.loading = false;
      }
    )
  }

  async onFavorite() {

    //if no login session, then show an alert and return;
    if(isNaN(this.userId) || this.userId == null){
      this.errorService.showAlertMessage('Login Required!', 'Please login to continue.');
      return false;
    }

    this.loading = true;
    if (!this.isFavorite) {
      const data = {
        movieId: this.movieId,
        userId: this.userId
      };
      (await this.favorite.addFavorite(data)).subscribe(
        (res: any) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
            // this.toast.onSuccess('Movie successfully added to favourites');
            this.isFavorite = true;
            this.favorite.setFavorite_update('1');
            this.favIcon = 'heart';
            this.reloadHomeData();
          }
          this.loading = false;
        }, (err) => {
          // this.toast.onFail('Error in network');
          this.loading = false;
        }
      )
    } else {
      (await this.favorite.removeFavorite(this.userId, this.movieId)).subscribe(
        (res: any) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
            // this.toast.onSuccess('Movie is removed from favourites');
            this.favIcon = 'heart-outline';
            this.isFavorite = false;
            this.favorite.setFavorite_update('0');
            this.reloadHomeData();
          }
          this.loading = false;
        }, (err) => {
          // this.toast.onFail('Error in network');
          this.loading = false;
        }
      )
    }
  }

  reloadHomeData() {
    this.homeService.getFavouriteData();
  }

}
