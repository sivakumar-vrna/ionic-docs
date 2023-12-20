import { Component,Input, OnInit,ViewChild } from '@angular/core';
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
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/vrna/pages/notifications/notifications.service';
import { documentId } from 'firebase/firestore';

@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.scss'],
})
export class RentComponent implements OnInit {

  @Input() contentData: any;
  @ViewChild('inputPromoCode') inputPromoCode: any;  

  public cardData: any;
  selectedCard: any;
  isLoading: boolean = false;
  isPromoCode = false;
  isPromoCodeValid = false;
  contentPrice: number;
  contentCurrency:string;
  promoTxt = 'VRNAMVP2021';
  // currency: string = '';
  currency: string = localStorage.getItem('currency');


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
    private homeService: HomeService,
    private notificationService: NotificationService,
    ) { }

  async ngOnInit() {
    this.getCurrency();
    // this.currency = await this.getSelectedCurrency();

    this.contentPrice = this.contentData.ppmCost;
    this.contentCurrency = this.contentData.currency;
    this.onGetSavedCards();    
  }

  keypressOnCardGrop(event: KeyboardEvent, optindex: any): void {    
    let elem: any;
    if( event.key == 'Enter'){
      elem = document.getElementById('btnCheckout');         
    }
    if(event.key == 'ArrowUp'){
      const previousIndex = optindex - 1;
      if (previousIndex >= 0) {
        const previousRadio = document.getElementById('card_radio_' + previousIndex);
        if (previousRadio) {
          previousRadio.click();
          previousRadio.focus();
        }
      }  
      elem = document.getElementById('card_radio_'+(optindex-1));
      if(!elem){
        elem = document.getElementById('havePromoCheckBox');
      } 
    }
    if(event.key == 'ArrowDown'){
      const lastIndex = this.cardData.length - 1;
      const nextIndex = optindex + 1;
      if (nextIndex <= lastIndex) {
        const nextRadio = document.getElementById('card_radio_' + nextIndex);
        if (nextRadio) {
          nextRadio.click();
          nextRadio.focus();
        }
      }
      elem = document.getElementById('card_radio_'+(optindex+1));
      if(!elem){
        elem = document.getElementById('btnAddNewCard');
      }  
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
    if(event.key == 'ArrowLeft' || event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();
    }
  }
  keypressOnPromoCode(event:KeyboardEvent):void{
    if(event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'ArrowUp'){
      event.stopPropagation();
      event.preventDefault();
    }else if(event.key === 'Enter'){
      event.preventDefault();
    }else if (event.key === 'ArrowDown') {
        event.stopPropagation();
        if (this.inputPromoCode) {
        this.inputPromoCode.setFocus();
        } else {
        let elem = document.getElementById('card_radio_0');
        if (elem) {
          elem.focus();
          event.preventDefault();
        }else{
          if(!elem){
            const elem = document.getElementById('btnAddNewCard');
             event.stopPropagation();
             elem.focus();
             event.preventDefault();
           }
        }
      }
    }
  }
  
  

  keypressOnPromoInput(event: KeyboardEvent): void {    
    if(event.key == 'ArrowRight' || event.key == 'Enter'){
      let elem = document.getElementById('btnApplyPromo');
      if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }   
    }
    if(event.key == 'ArrowUp'){
      let elem = document.getElementById('havePromoCheckBox');
      if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }   
    }
    if(event.key == 'ArrowLeft' || event.key == 'ArrowDown'){
      event.stopPropagation();
      event.preventDefault();
    }
  }

  keypressOnPromoApplyBtn(event: KeyboardEvent): void {    
    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      this.inputPromoCode.setFocus();
      event.preventDefault();      
    }
    if(event.key == 'ArrowUp'){
      let elem = document.getElementById('havePromoCheckBox');
      if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }   
     }
     if(event.key == 'ArrowRight' || 'ArrowDown'){
      event.stopPropagation();
      event.preventDefault();
      }
     if(event.key == 'Enter'){
       let elem = document.getElementById('btnApplyPromo');
       if(elem){
        event.stopPropagation();
        elem.click();
        event.preventDefault();
      }   
     } 
    }

  keypreesOnremoveBtn(event: KeyboardEvent): void { 
    if(event.key == 'ArrowUp'|| event.key == 'ArrowLeft' || 'ArrowRight' ){
      event.stopPropagation();
      event.preventDefault();
    }
    if(event.key == 'ArrowDown'){
       let elem = document.getElementById('btnCheckout');
       if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
       }
    }
    if(event.key == 'Enter'){
      let elem = document.getElementById('removebtn');
      if(elem){
        event.stopPropagation();
        elem.click();
        event.preventDefault();
      }
    }
  }

  keypressOnCheckoutHeader(event: KeyboardEvent): void {    
    if(event.key == 'ArrowUp'){
      event.stopPropagation();
      let elem = document.getElementById('btnCheckout');
      if(elem){
        elem.focus();
      }
      event.preventDefault();      
    }
  }

  keyPressOnCheckoutFooter_2(event: KeyboardEvent): void { 
     let elem: any;   
    if(event.key == 'ArrowDown'){
      event.stopPropagation();
      event.preventDefault();    
    }
    if(event.key == 'ArrowUp'  && !this.isLoading){
      event.stopPropagation();
      const elem = document.getElementById('btnAddNewCard'); 
      elem.focus();
      event.preventDefault(); 
    }
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      event.preventDefault();  
    }
    if(this.isLoading){
       if(event.key == 'ArrowLeft' || event.key == 'ArrowUp'){
        event.stopPropagation();
        event.preventDefault();
       }
    }

    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }

  keyPressOnCheckoutFooter_1(event:KeyboardEvent):void{
    let elem: any;   
    if(event.key == 'ArrowDown'){
      event.stopPropagation();
      event.preventDefault();    
    }
    if(event.key == 'ArrowUp'){
      elem = document.getElementById('btnAddNewCard');      
    }
    if(event.key == 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();  
    }

    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }
  

  keypressOnAddCardBtn(event: KeyboardEvent): void {    
    if(event.key == 'ArrowDown'){
      let elem = document.getElementById('btnCheckout');
      if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }   
    }
    if(event.key == 'ArrowRight' || 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();
    }
    if(event.key == 'Enter'){
      let elem = document.getElementById('btnAddNewCard');
      if(elem){
        event.stopPropagation();
        elem.click();
        event.preventDefault();
      }
    }
    if(event.key == 'ArrowUp'){
      let lastItemIndex = this.cardData.length - 1;
      let elem = document.getElementById('card_radio_' + lastItemIndex);
       if(!elem){
       const elem = document.getElementById('havePromoCheckBox');
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }
      if (elem) {
      event.stopPropagation();
      elem.focus();
      elem.click();
      event.preventDefault();
     }  
    }
   }

  async ngAfterViewInit(){
    setTimeout(() => {
      let firstElem = document.getElementById('btnAddNewCard');
      if(firstElem){
        firstElem.focus();
      }
    }, 500);   
   
  }  

  async getCurrency() {
    let countries = JSON.parse((await Storage.get({ key: COUNTRIES_KEY }))?.value);
    const location = (await Storage.get({ key: COUNTRY_KEY }))?.value;   
    
    if(countries == null){
      countries = JSON.parse(environment.json_countries);
    }

    this.currency = countries.find((x: any) => x.countryCode === location)?.currency;
  }

  async onGetSavedCards() {
    this.isLoading = true;
    const loading = await this.loadingController.create();
    (await this.paymentService.getSavedCards()).subscribe((res: any) => {
      const data = res.data;
      if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
        this.cardData = data;
        this.selectedCard = this.cardData[0];
        setTimeout(() => {
          let firstElem = document.getElementById('btnAddNewCard');
          if(firstElem){
            firstElem.focus();
          }
        }, 500); 
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
    this.selectedCard = e.detail.value;
  }

  async getSelectedCurrency() {
    let countries = JSON.parse((await Storage.get({ key: COUNTRIES_KEY }))?.value);
    const location = (await Storage.get({ key: COUNTRY_KEY }))?.value;   
    
    if(countries == null){
      countries = JSON.parse(environment.json_countries);
    }

    this.currency = countries.find((x: any) => x.countryCode === location)?.currency; 
  }

  async onGetRental() {
    this.isLoading = true;
    const userId = await this.userService.getUserId();
    const userName = await this.userService.getEmail();
    const selectedCurrency = this.currency || 'INR';
     const rentalData = {
      custId: userId,
      movieId: this.contentData.movieId,
      amount: this.contentPrice,
      currency:this.contentCurrency,
      //description: `This transaction is for renting the movie: ${this.contentData.moviename} ${this.currency} ${this.contentPrice}  by ${userName}`,
      description: `Movie: ${this.contentData.moviename}`,
      promoCode: this.contentPrice === 0 ? this.promoTxt : 'false',
      stripeCardId: this.isPromoCodeValid ? null : this.selectedCard.stripeCardId,
      stripeCustId: this.isPromoCodeValid ? null : this.selectedCard.stripeCustId
    };
  
    (await this.payService.onPayment(rentalData)).subscribe(
      (res: any) => {
        const data = res.data;
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          let msgBody: string;
          
          if (this.contentPrice === 0) {
            msgBody = `You have purchased ${this.contentData.moviename}  ${this.currency} 0.`;
          } else {
            msgBody = `You have purchased ${this.contentData.moviename} ${this.currency} ${this.contentData.ppmCost}.`;
          }
            //for notifications
          this.notificationService.showNotification(msgBody);
          try{
            this.utilService.onSuccess(msgBody);            
            this.uiRentDataService.setRented_update('1'); //this will refresh rented data
            this.dismiss(true);

          } catch(err){
            this.errorService.onError(err);          
          }          
          
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
      this.toast.wPopup('Sorry!, Promo code not valid');
    }
    setTimeout(() => {
      let elem = document.getElementById('removebtn');
      if(elem){
        elem.focus();
      }
    }, 100);  
  }

  clearCoupon() {
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

  promoCodeOptChanged(){
    if(this.isPromoCode){
      setTimeout(() => {
        this.inputPromoCode.setFocus();
      },150);
    }
  }
}
