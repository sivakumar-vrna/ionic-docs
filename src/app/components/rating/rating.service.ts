import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(
    private http: HttpService
  ) { }

  rateMovie(movieId: number, rating: number) {
    const baseUrl = environment.contentUrl;
    const url = baseUrl + 'movie/rating' + `?movieId=${movieId}&rating=${rating}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.postCall(url, capacitorUrl, null);
  }

}
