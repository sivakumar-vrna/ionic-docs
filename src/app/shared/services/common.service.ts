import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { Storage } from '@capacitor/storage';
import { COUNTRY_KEY } from 'src/app/vrna/services/ui-orchestration/orch.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private http: HttpService,
  ) { }

  async getCountries() {
    const baseUrl = environment.commonUrl;
    const url = baseUrl + 'common/country';
    const capacitorUrl = environment.capaciorUrl + url;
    return this.http.getCall(url, capacitorUrl);
  }

  getLocation() {
    //const country = null;
    //Storage.set({ key: COUNTRY_KEY, value: country });
  }
}
