import { Component, Input, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AddCardService } from 'src/app/components/add-card/add-card.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { UiRentDataService } from 'src/app/vrna/services/ui-orchestration/ui-rent-data.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { FormControl, Validators } from '@angular/forms';
import { ErrorService } from 'src/app/shared/services/error.service';
import { HomeService } from 'src/app/vrna/pages/home/home.service';
import { Storage } from '@capacitor/storage';
import { COUNTRIES_KEY, COUNTRY_KEY } from 'src/app/vrna/services/ui-orchestration/orch.service';

@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.scss'],
})
export class RentComponent implements OnInit {

  @Input() contentData: any;

  public cardData: any;
  selectedCard: any;
  isLoading: boolean = false;
  isPromoCode = false;
  isPromoCodeValid = false;
  contentPrice: number;
  promoTxt = 'VRNAMVP2021';
  currency: string = '';

  promoCode = new FormControl('', Validators.required);

  constructor(
    private payService: PaymentService,
    private userService: UserService,
    private paymentService: PaymentService,
    private addCardModal: AddCardService,
    public modalController: ModalController,
    public toast: ToastWidget,
    public errorService: ErrorService,
    private loadingController: LoadingController,
    private utilService: ToastWidget,
    private uiRentDataService: UiRentDataService,
    private homeService: HomeService
  ) { }

  async ngOnInit() {
    this.getCurrency();
    this.contentPrice = this.contentData.ppmCost;
    this.onGetSavedCards();
  }

  async getCurrency() {
    const countries = JSON.parse((await Storage.get({ key: COUNTRIES_KEY }))?.value);
    const location = (await Storage.get({ key: COUNTRY_KEY }))?.value;
    this.currency = countries.find((x: any) => x.countryCode === location)?.currency;
  }

  async onGetSavedCards() {
    this.isLoading = true;
    const loading = await this.loadingController.create();
    (await this.paymentService.getSavedCards()).subscribe((res: any) => {
      console.log(res);
      const data = res.data;
      if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
        this.cardData = data;
        console.log(this.cardData);
        this.selectedCard = this.cardData[0];
      } else {
        this.selectedCard = 'new';
      }
      this.isLoading = false;
      loading.dismiss();
    }, (err) => {
      this.isLoading = false;
      loading.dismiss();
    }
    );
  }

  onCardSelection(e) {
    console.log(e.detail.value)
    this.selectedCard = e.detail.value;
  }

  async onGetRental() {
    this.isLoading = true;
    const userId = await this.userService.getUserId();
    const userName = await this.userService.getEmail();
    const rentalData = {
      custId: userId,
      movieId: this.contentData.movieId,
      amount: this.contentPrice,
      currency: 'INR',
      description: `This transaction is for renting the movie: ${this.contentData.moviename} for INR ${this.contentPrice} by ${userName}`,
      promoCode: this.contentPrice === 0 ? this.promoTxt : 'false',
      stripeCardId: this.isPromoCodeValid ? null : this.selectedCard.stripeCardId,
      stripeCustId: this.isPromoCodeValid ? null : this.selectedCard.stripeCustId
    };
    (await this.payService.onPayment(rentalData)).subscribe(
      (res: any) => {
        console.log(res);
        const data = res.data;
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          const msgBody: string = `You have purchased ${this.contentData.moviename} for INR ${this.contentData.ppmCost}.`
          this.utilService.onSuccess(msgBody);
          this.uiRentDataService.userRentedMovies();
          this.homeService.getAllHomeData();
          this.localNotification(this.contentData.moviename, msgBody);
          this.dismiss(true);
        } else {
          this.errorService.onError(res);
        }
        this.isLoading = false;
      },
      (err) => {
        this.errorService.onError(err);
        this.isLoading = false;
      }
    );
  }

  async onAddNewCard() {
    this.addCardModal.onAddNewCard().then(res => {
      this.onGetSavedCards();
    });
  }

  applyCoupon() {
    const code = this.promoCode.value;
    if (code === this.promoTxt) {
      this.contentPrice = 0;
      this.promoCode.disable();
      this.isPromoCodeValid = true;
    } else {
      this.isPromoCodeValid = false;
      this.toast.onFail('Sorry!, Promo code not valid');
    }
  }

  clearCoupon() {
    console.log('Remove');
    this.contentPrice = this.contentData.ppmCost;
    this.isPromoCodeValid = false;
    this.promoCode.enable();
    this.promoCode.reset();
  }

  get validCouponCode() {
    return this.promoCode.valid;
  }

  async dismiss(status: boolean) {
    await this.modalController.dismiss(status);
    console.log('Rent is Closed')
  }

  // Local Notification
  async localNotification(title: string, body: string) {
    await LocalNotifications.requestPermissions();
    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: body,
          id: 1,
        }
      ]
    })
  }
}
