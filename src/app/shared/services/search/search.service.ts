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

    async onGenreSearch(genreId: number) {
        const baseUrl = environment.vrnaFlowUrl + 'genre';
        const userId = await this.userService.getUserId();
        const url = baseUrl + `?genre=${genreId}&userId=${userId}`;
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.getCall(url, capacitorUrl);
    }

    addParameterToURL(param){
        var url = "";
        url += (param.split('?')[1] ? '&':'?') + param;
        return url;
    }

    async onFilteredSearch(params: any) {
        const baseUrl = environment.vrnaFlowUrl + 'search';
        const userId = await this.userService.getUserId();
        var  url = baseUrl + `?userId=${userId}`;
        var q = Object.entries(params).map(([key, val])=>`${key}=${val}`).join("&");        
        url = url + "&"+ q;        
        const capacitorUrl = environment.capaciorUrl + url;        
        return this.http.getCall(url, capacitorUrl);
    }

    onSearchfiltered(params: any): Observable<any> {
        const baseUrl = environment.vrnaFlowUrl + 'search';
        let userId: any;


        try{

          userId = localStorage.getItem('USER_KEY');
          if(userId == null){
            userId = this.getUserId();            
          }

          params.userId = userId;
          //params.userId = userId;
        } catch(err){
          alert('err: '+err);
        }

        //error is here//
        //TBD
        //alert(params);

        const headers = this.getHeaders()
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
