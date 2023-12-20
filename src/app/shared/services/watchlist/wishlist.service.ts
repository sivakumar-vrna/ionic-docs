import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { HttpService } from '../http.service';
import { UserService } from '../user.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HomeService } from 'src/app/vrna/pages/home/home.service';

@Injectable({
    providedIn: 'root'
})
export class WishListService {
    
    private wishlistSubject = new BehaviorSubject<string | null>(null);
    wishlist_update$ = this.wishlistSubject.asObservable();

    baseUrl = environment.watchlistUrl;
    wishlistContents = new Subject();

    constructor(
        private http: HttpService,
        private userService: UserService,
        private toast: ToastWidget,
        private homeService: HomeService,
    ) { }

    async getWishList() {
        const currentUserId = await this.userService.getUserId();
        const url = this.baseUrl + 'wishlist/' + currentUserId;
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.getCall(url, capacitorUrl);
    }

    async getWishListStatus(movieId: number) {
        const currentUserId = await this.userService.getUserId();
        const url = this.baseUrl + 'wishlist/status?userId='+currentUserId+'&movieId='+movieId;
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.getCall(url, capacitorUrl);
    }

    async getBlockedStatus(movieId: number) {
        const currentUserId = await this.userService.getUserId();
        const url = this.baseUrl + 'block/status?userId='+currentUserId+'&movieId='+movieId;
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.getCall(url, capacitorUrl);
    }

    async getLikeStatus(movieId: number) {
        const currentUserId = await this.userService.getUserId();
        const url = this.baseUrl + 'liked/status?userId='+currentUserId+'&movieId='+movieId;
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.getCall(url, capacitorUrl);
    }

    addToWishList(movie: any) {
        const url = this.baseUrl + 'wishlist/add';
        const capacitorUrl = environment.capaciorUrl + url;
        let res = this.http.postCall(url, capacitorUrl, movie);
        this.setWishlistUpdate('1');
        return res;
    }       

    removeFromWishList(movie: any) {
        const url = this.baseUrl + 'wishlist/delete';
        const capacitorUrl = environment.capaciorUrl + url;
        const res = this.http.postCall(url, capacitorUrl, movie);
        this.setWishlistUpdate('1');

        return res;
    }

    addLikes(movie: any) {
        const url = this.baseUrl + 'liked/add';
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.postCall(url, capacitorUrl, movie);
    }   

    removeLikes(movie: any) {
        const url = this.baseUrl + 'liked/delete';
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.postCall(url, capacitorUrl, movie);
    }

    addBlock(movie: any) {
        const url = this.baseUrl + 'block/add';
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.postCall(url, capacitorUrl, movie);
    }   

    removeBlock(movie: any) {
        const url = this.baseUrl + 'block/delete';
        const capacitorUrl = environment.capaciorUrl + url;
        return this.http.postCall(url, capacitorUrl, movie);
    }

    //  #Get the list of Watched Movies
    async getWatchlist() {
        let wishlistData = [];
        (await this.getWishList()).subscribe(
            (res) => {
                wishlistData = res.data;
                if (wishlistData != null && wishlistData[0]) {
                    this.wishlistContents.next(wishlistData);
                }
            },
            (err) => {
                // this.toast.onFail('Error in getting watchlist');
            }
        );
    }

    setWishlistUpdate(value: string) {
      this.wishlistSubject.next(value);      
    }
}
