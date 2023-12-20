import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/shared/services/user.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Injectable({
    providedIn: 'root'
})

export class SwitchProfilesService {
    constructor(
        private http: HttpService,
        private userService: UserService,
        private http1: HttpClient
    ) { }

  async getProfiles() {
    const user = await this.userService.getUserId();
    const baseUrl = environment.authUrl;
    const url = baseUrl + 'profile/user' + `?userId=${user}`; 
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }
  
  addProfile(data: any) {
    const baseUrl = environment.authUrl;
    const url = baseUrl + 'profile/add';
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.postCall(url, capacitorUrl, data);
  }
  
  removeProfile(UId) {
    const baseUrl = environment.authUrl;
    const url = baseUrl + 'profile/delete' + `?profileId=${UId}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http1.post(url, capacitorUrl);
  }
}
