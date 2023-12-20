import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private favoriteSubject = new BehaviorSubject<string | null>(null);
  favorite_update$ = this.favoriteSubject.asObservable();

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

  setFavorite_update(value: string) {
    localStorage.setItem('favorite_has_update', value);
    this.favoriteSubject.next(value);
  }

  getFavorite_update(): string | null {
    return localStorage.getItem('favorite_has_update');
  }
}
