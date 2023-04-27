import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { HomeService } from 'src/app/vrna/pages/home/home.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { FavoriteService } from './favorite.service';

@Component({
  selector: 'app-favorite-btn',
  templateUrl: './favorite-btn.component.html',
  styleUrls: ['./favorite-btn.component.scss'],
})
export class FavoriteBtnComponent implements OnInit {

  @Input() movieId: number;
  @Input() userId: number;

  isFavorite: boolean = false;
  favIcon = 'heart';
  loading = false;

  constructor(
    private favorite: FavoriteService,
    private userService: UserService,
    private toast: ToastWidget,
    private homeService: HomeService
  ) { }

  async ngOnInit() {
    this.userId = await this.userService.getUserId();
    await this.getFavoriteStatus();
  }

  async getFavoriteStatus() {
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
          this.toast.onFail('Error in response');
        }
        this.loading = false;
      }, (err) => {
        this.toast.onFail('Error in network');
        this.loading = false;
      }
    )
  }

  async onFavorite() {
    this.loading = true;
    if (!this.isFavorite) {
      const data = {
        movieId: this.movieId,
        userId: this.userId
      };
      (await this.favorite.addFavorite(data)).subscribe(
        (res: any) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
            this.toast.onSuccess('Movie succesfully added to favourite');
            this.isFavorite = true;
            this.favIcon = 'heart';
            this.reloadHomeData();
          }
          this.loading = false;
        }, (err) => {
          this.toast.onFail('Error in network');
          this.loading = false;
        }
      )
    } else {
      (await this.favorite.removeFavorite(this.userId, this.movieId)).subscribe(
        (res: any) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
            this.toast.onSuccess('Movie is removed from favourites');
            this.favIcon = 'heart-outline';
            this.isFavorite = false;
            this.reloadHomeData();
          }
          this.loading = false;
        }, (err) => {
          this.toast.onFail('Error in network');
          this.loading = false;
        }
      )
    }
  }

  reloadHomeData() {
    this.homeService.getFavouriteData();
  }

}
