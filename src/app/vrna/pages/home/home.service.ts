import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { VrnaflowService } from 'src/app/shared/services/vrnaflow.service';
import { OrchService } from '../../services/ui-orchestration/orch.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class HomeService {

    public isOpen = new BehaviorSubject<boolean>(false);

    homeData$ = new Subject();
    bannerData = new Subject();
    favouritesData = new Subject();
    wishlistData = new Subject();
    rentedData = new Subject();
    continueWatchData = new Subject();

    featuredCastData = new Subject();

    constructor(
        private vrnaflowService: VrnaflowService,
        private orchService: OrchService,
        private errorService: ErrorService,
    ) { }

    async getAllHomeData() {
        await this.getBannerData();
        await this.getContinueWatchData();
        await this.getFavouriteData();
        await this.getWishlistData();
        await this.getRentedData();
        await this.getHomeData();
        await this.getFeaturedCast();
    }

    async getBannerData() {
        (await this.vrnaflowService.getBanners()).subscribe(
            (res: any) => {
                if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
                    let tempData = res.data;
                    this.bannerData.next(this.orchService.orchestrateData(tempData));
                    tempData = null;
                } else {
                    this.errorService.onError(res);
                }
                res = null;
            },
            (err) => {
                this.errorService.onError(err);
            }
        );
    }

    async getFavouriteData() {
        (await this.vrnaflowService.getFavourites()).subscribe(
            (res: any) => {
                if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
                    let tempData = res.data;
                    this.favouritesData.next(this.orchService.orchestrateData(tempData));
                    tempData = null;
                } else {
                    this.errorService.onError(res);
                }
                res = null;
            },
            (err) => {
                this.errorService.onError(err);
            }
        );
    }

    async getWishlistData() {
        (await this.vrnaflowService.getWishlist()).subscribe(
            (res: any) => {
                if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
                    let tempData = res.data;
                    this.wishlistData.next(this.orchService.orchestrateData(tempData));
                    tempData = null;
                } else {
                    this.errorService.onError(res);
                }
                res = null;
            },
            (err) => {
                this.errorService.onError(err);
            }
        );
    }

    async getRentedData() {
        (await this.vrnaflowService.getRented()).subscribe(
            (res: any) => {
                if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
                    let tempData = res.data;
                    this.rentedData.next(this.orchService.orchestrateData(tempData));
                    tempData = null;
                } else {
                    this.errorService.onError(res);
                }
                res = null;
            },
            (err) => {
                this.errorService.onError(err);
            }
        );
    }

    async getContinueWatchData() {
        (await this.vrnaflowService.getContinueWatching()).subscribe(
            (res: any) => {
                if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
                    let tempData = res.data;
                    //tempData.map(result => result['posterurl'] = 'https://media.vrnplex.com' + result.posterurl);
                    this.continueWatchData.next(this.orchService.orchestrateData(tempData));
                    tempData = null;
                } else {
                    this.errorService.onError(res);
                }
                res = null;
            },
            (err) => {
                this.errorService.onError(err);
            }
        );
    }

    async getHomeData() {
        (await this.vrnaflowService.onLoadHomePage()).subscribe(
            (res: any) => {
                if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
                    let tempData = res.data;
                    this.dataConstruction(tempData);
                    tempData = null;
                } else {
                    this.errorService.onError(res);
                }
                res = null;
            },
            (err) => {
                this.errorService.onError(err);
            }
        );
    }

    async getFeaturedCast() {
        (await this.vrnaflowService.featuredCast() ).subscribe(
            (res: any) => {
                if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
                    let tempData = res.data;


                    //map the cast data with correct url
                    tempData.map(castmap => {
                        //cast['imageUrl'] = this.domainUrl + '/images' + cast.imageUrl;
                        castmap['imageUrl'] = environment.cloudflareUrl + castmap.imageUrl;
                    });
                    this.featuredCastData.next(tempData);          


                    tempData = null;
                } else {
                    this.errorService.onError(res);
                }
                res = null;
            },
            (err) => {
                this.errorService.onError(err);
            }
        );
    }

    dataConstruction(data: any) {
        let tempHomedata = [];
        Object.keys(data).forEach(key => {
            let tempData = {
                title: key,
                data: this.orchService.orchestrateData(data[key])
            };
            tempHomedata.push(tempData);
            tempData = null;
        });
        this.homeData$.next(tempHomedata);
        tempHomedata = null;
    }
}
