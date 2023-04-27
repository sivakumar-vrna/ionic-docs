import { Injectable } from '@angular/core';
import { isPlatform } from '@ionic/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { VrnaflowService } from 'src/app/shared/services/vrnaflow.service';
import { environment } from 'src/environments/environment';
import { OrchService } from '../../services/ui-orchestration/orch.service';

@Injectable({
    providedIn: 'root'
})

export class HomeService {

    public isOpen = new BehaviorSubject<boolean>(false);

    homeData$ = new Subject();
    bannerData = new Subject();
    favouritesData = new Subject();
    rentedData = new Subject();
    continueWatchData = new Subject();

    constructor(
        private vrnaflowService: VrnaflowService,
        private orchService: OrchService,
        private errorService: ErrorService,
    ) { }

    async getAllHomeData() {
        await this.getBannerData();
        await this.getContinueWatchData();
        await this.getFavouriteData();
        await this.getRentedData();
        await this.getHomeData();
    }

    async getBannerData() {
        (await this.vrnaflowService.getBanners()).subscribe(
            (res: any) => {
                if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
                    const tempData = res.data;
                    this.bannerData.next(this.orchService.orchestrateData(tempData));
                } else {
                    this.errorService.onError(res);
                }
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
                    const tempData = res.data;
                    this.favouritesData.next(this.orchService.orchestrateData(tempData));
                } else {
                    this.errorService.onError(res);
                }
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
                    const tempData = res.data;
                    this.rentedData.next(this.orchService.orchestrateData(tempData));
                } else {
                    this.errorService.onError(res);
                }
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
                    const tempData = res.data;
                    this.continueWatchData.next(this.orchService.orchestrateData(tempData));
                } else {
                    this.errorService.onError(res);
                }
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
                    const tempData = res.data;
                    
                    this.dataConstruction(tempData);
                    
                } else {
                    this.errorService.onError(res);
                }
            },
            (err) => {
                this.errorService.onError(err);
            }
        );
    }

    dataConstruction(data: any) {
        const tempHomedata = [];
        Object.keys(data).forEach(key => {
            const tempData = {
                title: key,
                data: this.orchService.orchestrateData(data[key])
            };
            tempHomedata.push(tempData);
        });
        this.homeData$.next(tempHomedata);
    }
}
