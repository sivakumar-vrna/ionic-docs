import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  constructor(
    private http: HttpService,
    private userService: UserService
  ) { }

  async getProfile() {
    const id = await this.userService.getUserId();
    const baseUrl = environment.vrnaFlowUrl;
    const url = baseUrl + 'profile' + `/${id}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.postCall(url, capacitorUrl, null);
  }

  updateProfile(data: any) {
    const baseUrl = environment.authUrl;
    const url = baseUrl + 'user/update';
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.postCall(url, capacitorUrl, data);
  }

  async getTransactions() {
    const userId = await this.userService.getUserId();
    const baseUrl = environment.vrnaFlowUrl;
    const url = baseUrl + 'allrented/' + userId;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

  getProfileImgUploadUrl() {
    const baseUrl = environment.awsUrl;
    const url = baseUrl + 'aws/user/upload?fileType=jpg';
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

}
