import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { IntelligenceService, RENTED_KEY } from '../../../shared/services/intelligence.service';
import { Storage } from '@capacitor/storage';

@Injectable({
    providedIn: 'root'
})

export class UiRentDataService {

    rentedMoviesList$ = new Subject();
    rentContentData = new Subject();
    isNewMovieRented$ = new Subject<boolean>();
    
    private rentedSubject = new BehaviorSubject<string | null>(null);
    rented_update$ = this.rentedSubject.asObservable();
  

    constructor(
        private intelligenceService: IntelligenceService,
        private toaster: ToastWidget
    ) { }


    // #Get the list of Rented Movies by the User

    async userRentedMovies() {
        let rentedMoviesList: any = [];
        (await this.intelligenceService.getFilterMovies('rented')).subscribe((res: any) => {
            const rentedMovies = res.data;
            if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
                if (rentedMovies === undefined || rentedMovies.length === 0 || rentedMovies === null) {
                    Storage.set({ key: RENTED_KEY, value: JSON.stringify(null) });
                }
                else if (rentedMovies !== null && rentedMovies[0]) {
                    rentedMoviesList = rentedMovies.map(x => {
                        return x.movieId;
                    });
                    Storage.set({ key: RENTED_KEY, value: JSON.stringify(rentedMoviesList) });
                    this.rentedMoviesList$.next(rentedMoviesList);
                }
                this.onNewMovieRented(true);
            } else {
                // this.toaster.onFail('Error in request');
            }
        }, (err) => {
            // this.toaster.onFail('Error in request');
        }
        )
    }

    onNewMovieRented(isRented: boolean) {
        this.isNewMovieRented$.next(isRented);
    }

    setRented_update(value: string) {
        localStorage.setItem('rented_has_update ', value);
        this.rentedSubject.next(value);
      }
    
      getRented_update(): string | null {
        return localStorage.getItem('rented_has_update ');
      }

}
