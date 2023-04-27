import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';

export const RENTED_KEY = 'rented';

@Injectable({
    providedIn: 'root'
})
export class CastService {

    constructor(
        private http: HttpService
    ) { }

    async onCastMovies(castId: any) {
        const baseUrl = environment.contentUrl + 'movie/castmovies';
        const url = baseUrl + `?castId=${castId}`;
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.getCall(url, capacitorUrl);
    }
    async onCastActor(castId: any) {
        const baseUrl = environment.contentUrl + `cast/${castId}`;
        const capacitorUrl = environment.capaciorUrl;
        return this.http.getCall(baseUrl, capacitorUrl);
    }
}
