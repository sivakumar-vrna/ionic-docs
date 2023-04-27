import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { UserService } from 'src/app/shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  constructor(
    private http: HttpService,
    private userService: UserService
  ) { }

  getMovieDetail(id) {
    const baseUrl = environment.vrnaFlowUrl;
    const url = baseUrl +  'movie' + `/${id}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

  async getMovieCasts(id: any) {
    const userId = await this.userService.getUserId();
    const baseUrl = environment.vrnaFlowUrl;
    const url = baseUrl + 'moviecast' + `?movieId=${id}&userId=${userId}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

  async getMenuContent(menuName: string) {
    const userId = await this.userService.getUserId();
    const baseUrl = environment.vrnaFlowUrl;
    const url = baseUrl + 'menu' + `?userId=${userId}&menuName=${menuName}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

  async getRelatedSuggestion(id: any) {
    const userId = await this.userService.getUserId();
    const baseUrl = environment.vrnaFlowUrl;
    const url = baseUrl + 'morelikethis' + `?movieId=${id}&userId=${userId}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }


}
