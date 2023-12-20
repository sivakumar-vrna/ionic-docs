import { Injectable } from '@angular/core';
import { isPlatform } from '@ionic/core';
import { Storage } from '@capacitor/storage';
import { HttpService } from 'src/app/shared/services/http.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { environment } from 'src/environments/environment';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { VrnaflowService } from 'src/app/shared/services/vrnaflow.service';
import { Router } from '@angular/router';

export const COUNTRIES_KEY = 'countries';
export const ROLES_KEY = 'roles';
export const COUNTRY_KEY = 'country';
export const GENRES_KEY = 'genres';
export const LOCALE_KEY = 'locale';
export const LOCALES_KEY = 'locales';
export const CURRENCY_KEY = 'currency';

@Injectable({
    providedIn: 'root'
})

export class OrchService {

    constructor(
        private http: HttpService,
        private toast: ToastWidget,
        private utilityService: UtilityService,
        private vrnaflowService: VrnaflowService,
        private router: Router
    ) { }

    orchestrateData(data: any) {
        let tempData: any[] = [];
        if (data !== null && data[0]) {
            const tempMoviesList = data;
            tempMoviesList.map(async (movie: any) => {
                await this.movieOrchestrate(movie);
            });
            tempData = tempMoviesList;
            return tempData;
        } else {
            return null;
        }
    }

    async movieOrchestrate(movie: any) {
        const genreName: any[] = [];
        const tempGenres = await Storage.get({ key: GENRES_KEY });
        const genresDataSrc = JSON.parse(tempGenres.value);
        const isRented = await this.utilityService.isRented(movie);
        movie['isRented'] = isRented;
        //movie['moviebannerurl'] = this.domainUrl + '/images' + movie.moviebannerurl;
        movie['moviebannerurl'] = environment.cloudflareUrl + movie.moviebannerurl;
        
        //movie['posterurl'] = this.domainUrl + '/images' + movie.posterurl;
        movie['posterurl'] = environment.cloudflareUrl+movie.posterurl;

        // movie['trailerurl']= this.domainUrl + '/' + movie.trailerurl;
        genresDataSrc?.map((genre: any) => {
            movie?.genre?.find((x: any) => x === genre.genreId) ? genreName.push(genre.genreDesc) : '';
        });
        movie['genreDesc'] = genreName;
        if(movie.percentWatched != 0){            
            movie['percentWatched'] = Number((movie.percentWatched / 100).toFixed(1));
        }
        
    }

    async getGenre() {
        const baseUrl = environment.commonUrl;
        const url = baseUrl + 'common/genres';
        const capacitorUrl = environment.capaciorUrl + url;
        (await this.http.getCall(url, capacitorUrl)).subscribe((res: any) => {
            if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
                const genres = res.data;
                Storage.set({ key: GENRES_KEY, value: JSON.stringify(genres) });
            } else {
                // this.toast.onFail('Error in getting genres');
            }
        }, (err: any) => {
            // this.toast.onFail('Network Error');
        });
    }

    async getAllConfiguration() {
        let countries = JSON.parse((await Storage.get({ key: COUNTRIES_KEY }))?.value);
        if(countries == null || countries == 'null'){

            let config_loaded = false;            

            (await this.vrnaflowService.getConfigurations()).subscribe((res: any) => {
                if (res.status.toLowerCase() == 'success' && res.statusCode == 200) {
                    Storage.set({ key: COUNTRIES_KEY, value: JSON.stringify(res?.data?.country) });
                    Storage.set({ key: ROLES_KEY, value: JSON.stringify(res?.data?.roles) });
                    Storage.set({ key: GENRES_KEY, value: JSON.stringify(res?.data?.genre) });
                    Storage.set({ key: LOCALES_KEY, value: JSON.stringify(res?.data?.locales) });
                    config_loaded = true;
                } else {
                    //this.toast.onFail('Error in getting master data');
                    config_loaded = false;

                    console.log('API Error'+JSON.stringify(res));
                }
            }, (err: any) => {
                //alert('Network error: '+err);
                //this.toast.onFail('Network Error');
                this.router.navigate(['/error/504']);
                config_loaded = false;

            });            


        }
    }




    

    get domainUrl() {
        if (isPlatform('capacitor')) {
            return environment.capaciorUrl;
        } else {
            return (window as any).location.origin;
        }
    }
}