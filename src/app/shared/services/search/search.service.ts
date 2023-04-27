import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';
import { UserService } from '../user.service';


export const RENTED_KEY = 'rented';

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    constructor(private http: HttpService, private userService: UserService, private httpClient: HttpClient) { }

    async onSearchSuggest(search: string) {
        const baseUrl = environment.contentUrl + 'movie/suggest';
        const userId = await this.userService.getUserId();
        const url = baseUrl + `?searchId=${search}&userId=${userId}`;
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.getCall(url, capacitorUrl);
    }

    async onSearch(searchKey: string) {
        const baseUrl = environment.vrnaFlowUrl + 'search';
        const userId = await this.userService.getUserId();
        const url = baseUrl + `?searchKey=${searchKey}&userId=${userId}`;
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.getCall(url, capacitorUrl);
    }

    onSearchfiltered(params: any): Observable<any> {
        const baseUrl = environment.vrnaFlowUrl + 'search';
        const userId = this.getUserId();
        params.userId = localStorage.getItem('USER_KEY');
        console.log(params);
        const headers = this.getHeaders()
        console.log(headers)
        return this.httpClient.get(baseUrl, { headers: headers, params: params })
    }

    async getUserId() {
        return await this.userService.getUserId().then(val => {
            return val
        });
    }

    getHeaders() {
        return this.http.setheaderValues();
    }

}
