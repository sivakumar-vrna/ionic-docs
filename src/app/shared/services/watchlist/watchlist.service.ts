import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { HttpService } from '../http.service';
import { UserService } from '../user.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';

@Injectable({
    providedIn: 'root'
})
export class WatchlistService {
    baseUrl = environment.watchlistUrl;
    watchlistContents = new Subject();

    constructor(
        private http: HttpService,
        private userService: UserService,
        private toast: ToastWidget
    ) { }

    async getWatchedMovies() {
        const currentUserId = await this.userService.getUserId();
        const url = this.baseUrl + 'watchlist/' + currentUserId;
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.getCall(url, capacitorUrl);
    }

    addWatchMovie(movie: any) {
        const url = this.baseUrl + 'watchlist/add';
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.postCall(url, capacitorUrl, movie);
    }

    //  #Get the list of Watched Movies
    async getWatchlist() {
        let watchlistData = [];
        (await this.getWatchedMovies()).subscribe(
            (res) => {
                console.log(res);
                watchlistData = res.data;
                if (watchlistData != null && watchlistData[0]) {
                    this.watchlistContents.next(watchlistData);
                }
            },
            (err) => {
                this.toast.onFail('Error in getting watchlist');
            }
        );
    }
}
