import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class VrnaflowService {
  getSearchData(content: any) {
    throw new Error('Method not implemented.');
  }

  vrnaFlowUrl: string = environment.vrnaFlowUrl;

  constructor(
    private http: HttpService,
    public userService: UserService
  ) { }

  async onLoadHomePage() {
    const user = await this.userService.getUserId();
    const url = this.vrnaFlowUrl + 'gohome' + `?userId=${Number(user)}&genreId=0`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

  async getBanners() {
    const user: number = Number(await this.userService.getUserId());
    const url = this.vrnaFlowUrl + `bannnermovies?userId=${user}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

  async getRented() {
    const user = await this.userService.getUserId();
    const url = this.vrnaFlowUrl + `rented/${user}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

  async getFavourites() {
    const user = await this.userService.getUserId();
    const url = this.vrnaFlowUrl + `favoritemovies?userId=${user}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

  async getContinueWatching() {
    const user = await this.userService.getUserId();
    const url = this.vrnaFlowUrl + `continuewatching?userId=${user}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

  async featuredCast() {
    const user = await this.userService.getUserId();
    const baseUrl = environment.contentUrl;
    const url = baseUrl + 'cast/featured' + `?userId=${user}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

  async getConfigurations() {
    const user = await this.userService.getUserId();
    const baseUrl = environment.vrnaFlowUrl;
    const url = baseUrl + 'masterdata' + `?userId=${user}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

  async getDataByGenre(genreId){
    const user = await this.userService.getUserId();
    const baseUrl = environment.contentUrl;
    const url = baseUrl+'movie/latest'+ `?userId=${user}&genre=`+ genreId;
    const capaciorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url,capaciorUrl);
  }
}
