import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { UserService } from './user.service';

export const RENTED_KEY = 'rented';

@Injectable({
  providedIn: 'root'
})
export class IntelligenceService {

  constructor(private http: HttpService, private userService: UserService) { }

  async getFilterMovies(filter: string) {
    const userId = await this.userService.getUserId();
    const baseUrl = environment.vrnaFlowUrl;
    const url = baseUrl + `menu?userId=${userId}&menuName=${filter}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

}
