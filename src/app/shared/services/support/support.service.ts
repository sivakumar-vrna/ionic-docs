import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';

@Injectable({
    providedIn: 'root'
})
export class supportService {

    constructor(
        private http: HttpService
    ) { }

    async reachUs(postData: any) {
        const url = environment.supportUrl + 'support/query';
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.postCall(url, capacitorUrl, postData);
    }

}
