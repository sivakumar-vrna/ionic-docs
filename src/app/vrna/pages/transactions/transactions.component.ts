import { Component, OnInit } from '@angular/core';
import { isPlatform } from '@ionic/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {

  transactionsDataSource: any;

  constructor(
    private profileService: ProfileService,
    private errorService: ErrorService,
  ) { }

  ngOnInit() {
    this.getTransactions();
  }

  async getTransactions() {
    (await this.profileService.getTransactions()).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          const tempData = res.data;
          console.log(tempData);
          this.transactionsDataSource = this.orchestrateData(tempData);
        } else {
          this.errorService.onError(res);
        }
      },
      (err: any) => {
        this.errorService.onError(err);
      }
    )
  }

  orchestrateData(data) {
    let tempData = [];
    if (data !== null && data[0]) {
      const tempMoviesList = data;
      tempMoviesList.map((trans: any) => {
        trans['posterImage'] = this.domainUrl + '/images' + trans.posterImage;
      });
      tempData = tempMoviesList;
      return tempData;
    } else {
      return null;
    }
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.getTransactions();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  get domainUrl() {
    if (isPlatform('capacitor')) {
      return environment.capaciorUrl;
    } else {
      return window.location.origin;
    }
  }
}
