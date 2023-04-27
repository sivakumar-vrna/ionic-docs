import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { ModalController } from '@ionic/angular';
import { HomeService } from 'src/app/vrna/pages/home/home.service';
import { COUNTRIES_KEY, COUNTRY_KEY, CURRENCY_KEY, OrchService } from 'src/app/vrna/services/ui-orchestration/orch.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  countries: any[] = [];
  location: string = '';
  currency: string = '';
  searchText: string = '';

  constructor(
    public modalController: ModalController,
    public homeService: HomeService,
  ) { }

  async ngOnInit() {
    this.countries = JSON.parse((await Storage.get({ key: COUNTRIES_KEY }))?.value);
    this.location = (await Storage.get({ key: COUNTRY_KEY })).value;
  }

  onLocation(countryCode: string, currency: string) {
    this.location = countryCode;
    this.currency = currency;
  }

 async onSubmit() {
    Storage.set({ key: COUNTRY_KEY, value: this.location });
    Storage.set({ key: CURRENCY_KEY, value: this.currency });
    this.dismiss();
    await this.homeService.getAllHomeData();
    window.location.reload();
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  onSearchCountry(e: any) {
    const query = e.target.value.toLowerCase();
    this.searchText = query;
  }
}
