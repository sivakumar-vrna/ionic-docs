import { Injectable } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FavoriteMoviesService {

  private searchbarRef: IonSearchbar;

  setSearchbarRef(ref: IonSearchbar): void {
    this.searchbarRef = ref;
  }

  setFocusOnSearchbar(): void {
    if (this.searchbarRef) {
      this.searchbarRef.setFocus();
    }
  }}