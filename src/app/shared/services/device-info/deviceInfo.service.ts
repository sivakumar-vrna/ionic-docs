import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user.service';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceInfoService {
  constructor(
    private http1: HttpClient,
    private http: HttpService,
    private userService: UserService
  ) {}

  async getDeviceInfo() {
    const user = await this.userService.getUserId();
    const baseUrl = environment.authUrl;
    const url = baseUrl + 'device/user' + `?userId=${user}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

  addDeviceInfo(data: any): Observable<any> {
    const baseUrl = environment.authUrl;
    const url = baseUrl + 'device/add';
    return this.http1.post<any>(url, data);
  }

  addCapinfo(data: any) {
    const baseUrl = environment.authUrl;
    const url = baseUrl + 'device/add';
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.postCall(url, capacitorUrl, data);
  }

  removeDeviceInfo(devId) {
    const baseUrl = environment.authUrl;
    const url = baseUrl + 'device/' + `${devId}`;
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.deleteCall(url, capacitorUrl);
  }

  updateDeviceInfo(data: any) {
    const baseUrl = environment.authUrl;
    const url = baseUrl + 'device/update';
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.postCall(url, capacitorUrl, data);
  }
}
