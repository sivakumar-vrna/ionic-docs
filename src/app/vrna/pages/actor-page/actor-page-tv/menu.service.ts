import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuActive: number = 0; // Initialize with default value

  updateMenuActive(id: number) {
    this.menuActive = id;
  }

  getMenuActive() {
    return this.menuActive;
  }
}