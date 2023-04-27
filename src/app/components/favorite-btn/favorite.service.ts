import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(
    private userService: UserService,
    private http: HttpService
  ) { }

  getFavorite(userId: number, movieId: number) {
    const baseUrl = environment.watchlistUrl;
    const url = baseUrl + 'favorites/' + `${userId}?movieId=${movieId}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

  addFavorite(data: any) {
    const baseUrl = environment.watchlistUrl;
    const url = baseUrl + 'favorites/add';
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.postCall(url, capacitorUrl, data);
  }

  removeFavorite(userId: number, movieId: number) {
    const baseUrl = environment.watchlistUrl;
    const url = baseUrl + 'favorites/' + `${userId}?movieId=${movieId}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.deleteCall(url, capacitorUrl);
  }
}
