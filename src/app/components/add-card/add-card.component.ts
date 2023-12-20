import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/shared/services/user.service';
import { DatePipe } from '@angular/common';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { ErrorService } from 'src/app/shared/services/error.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss'],
})
export class AddCardComponent implements OnInit {

  emailId: string;
  stripeCustId: string;
  userId: number;
  newCardForm: FormGroup;
  isSubmitted = false;
  dateobj = new Date();
  selectYears: any[] = [];
  maxExpiryYear = 20;

  constructor(
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    public userService: UserService,
    private datePipe: DatePipe,
    private cardService: PaymentService,
    private toast: ToastWidget,
    private errorService: ErrorService,
  ) {

  }  

  keypressCardNum(event: KeyboardEvent): void {    
    if(event.key == 'ArrowDown' || event.key == 'ArrowRight' || event.key == 'Enter'){
        event.stopPropagation();
        const elem = document.getElementById('idOptMonth');
        if (elem) {
          elem.focus();
          elem.classList.add('highlighted'); 
        }      
        event.preventDefault();
        elem.addEventListener('blur', () => {
        elem.classList.remove('highlighted'); 
      });
    }
  }

  keypressOnCardMonth(event: KeyboardEvent): void {    
    if(event.key == 'ArrowRight'){
        event.stopPropagation();
        const elem = document.getElementById('idOptYear');
        if (elem) {
          elem.focus();
          elem.classList.add('highlighted'); 
        }      
        event.preventDefault();
        elem.addEventListener('blur', () => {
        elem.classList.remove('highlighted'); 
      });
    }
    if(event.key == 'Enter'){
      event.stopPropagation();
      const elem = document.getElementById('idOptMonth');
      elem.focus();
    } 
    if(event.key == 'ArrowUp'){
        event.stopPropagation();
        const elem = document.getElementById('idCardNumber');
        if (elem) {
          elem.focus();
          elem.classList.add('highlighted'); 
        }      
        event.preventDefault();
        elem.addEventListener('blur', () => {
        elem.classList.remove('highlighted'); 
      });
    }   
  }

  keypressOnCardYear(event: KeyboardEvent): void {    
    if(event.key == 'ArrowRight'){
        event.stopPropagation();
        const elem = document.getElementById('idCardCVV');
        if (elem) {
          elem.focus();
          elem.classList.add('highlighted'); 
        }      
        event.preventDefault();
        elem.addEventListener('blur', () => {
        elem.classList.remove('highlighted'); 
      });
    }
    if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        const elem = document.getElementById('idOptMonth');
        if (elem) {
          elem.focus();
          elem.classList.add('highlighted'); 
        }      
        event.preventDefault();
        elem.addEventListener('blur', () => {
        elem.classList.remove('highlighted'); 
      });
    }
    if(event.key == 'Enter'){
      event.stopPropagation();
      const elem = document.getElementById('idOptYear');
      elem.focus();
    }
    if(event.key == 'ArrowUp'){
      event.stopPropagation();
      const elem = document.getElementById('idCardNumber');
      if (elem) {
        elem.focus();
        elem.classList.add('highlighted'); 
      }      
      event.preventDefault();
      elem.addEventListener('blur', () => {
      elem.classList.remove('highlighted'); 
    });
  }
 }

  keypressOnCardCVV(event: KeyboardEvent): void {    
    if(event.key == 'ArrowDown' || event.key == 'ArrowRight' || event.key == 'Enter'){
      event.stopPropagation();
      const elem = document.getElementById('btnSaveCard');
      elem.focus();
    }
    if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        const elem = document.getElementById('idOptYear');
        if (elem) {
          elem.focus();
          elem.classList.add('highlighted'); 
        }      
        event.preventDefault();
        elem.addEventListener('blur', () => {
        elem.classList.remove('highlighted'); 
      });
    }
    if(event.key == 'ArrowUp'){
      event.stopPropagation();
      const elem = document.getElementById('idCardNumber');
      if (elem) {
        elem.focus();
        elem.classList.add('highlighted'); 
      }      
      event.preventDefault();
      elem.addEventListener('blur', () => {
      elem.classList.remove('highlighted'); 
    });
   }
  }
  keypressOnbtnSaveCard(event:KeyboardEvent):void{
    if(event.key == 'ArrowUp'){
      event.stopPropagation();
    const elem = document.getElementById('idCardCVV');
    if (elem) {
      elem.focus();
      elem.classList.add('highlighted'); 
    }      
    event.preventDefault();
    elem.addEventListener('blur', () => {
    elem.classList.remove('highlighted'); 
  });
  }
  if(event.key == 'ArrowDown' || event.key == 'ArrowRight'){
    event.stopPropagation();
    const elem = document.getElementById('idCardNumber');
    if (elem) {
      elem.focus();
      elem.classList.add('highlighted'); 
    }      
    event.preventDefault();
    elem.addEventListener('blur', () => {
    elem.classList.remove('highlighted'); 
  });
  }
}
  keypressOnbtnCencelCard(event:KeyboardEvent):void{
    if(event.key == 'ArrowUp'){
    event.stopPropagation();
    const elem = document.getElementById('idOptMonth');
    if (elem) {
      elem.focus();
      elem.classList.add('highlighted'); 
    }      
    event.preventDefault();
    elem.addEventListener('blur', () => {
    elem.classList.remove('highlighted'); 
  });
  }
  if(event.key == 'ArrowDown' || event.key == 'ArrowLeft'){
    event.stopPropagation();
    const elem = document.getElementById('idCardNumber');
    if (elem) {
      elem.focus();
      elem.classList.add('highlighted'); 
    }      
    event.preventDefault();
    elem.addEventListener('blur', () => {
    elem.classList.remove('highlighted'); 
  });
  }
}
  

  async ngOnInit() {
    console.time('Perf: CompnAddCard Screen');
    // console.log(this.dateobj.getFullYear());
    this.userService.getEmail().then(res => this.emailId = res);
    this.userService.getStripeId().then(res => this.stripeCustId = res);
    this.cardForm();
    this.getSelectionYears();
  }

  ngAfterViewInit() {
    console.timeEnd('Perf: CompnAddCard Screen');

    setTimeout(() => {
      let firstElem = document.getElementById('idCardNumber');
      if (firstElem) {
        firstElem.focus();
        firstElem.classList.add('highlighted'); 
      }      
      firstElem.addEventListener('blur', () => {
      firstElem.classList.remove('highlighted'); 
    });
    }, 1000);

  }

  getSelectionYears() {
    const years: any[] = [];
    const currentYear = this.dateobj.getFullYear();
    for (let i = 0; i < this.maxExpiryYear; i++) {
      years.push(currentYear + i);
    }
    this.selectYears = years;
  }

  cardForm() {
    this.newCardForm = this.formBuilder.group({
      cardNo: ['', [Validators.required, Validators.minLength(16), Validators.pattern('^[0-9]*$')]],
      expiryMonth: ['', Validators.required],
      expiryYear: ['', Validators.required],
      secretPin: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  get f() {
    return this.newCardForm.controls;
  }

  async onSubmit() {
    this.isSubmitted = true;
    this.userId = await this.userService.getUserId();
    const postData = {
      emailId: this.emailId,
      userId: this.userId,
      stripeCustId: this.stripeCustId,
      stripeCardId: null,
      cardNo: this.newCardForm.value.cardNo,
      expiryMonth: this.newCardForm.value.expiryMonth,
      expiryYear: this.newCardForm.value.expiryYear,
      secretPin: this.newCardForm.value.secretPin,
      stripetokenId: null,
      date: null
    }
    if (this.newCardForm.valid) {

      (await this.cardService.addCard(postData)).subscribe(res => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          // this.toast.onSuccess(res?.message);
          this.modalController.dismiss({
            'newcard': true
          });
        } else {
          this.errorService.showAlertMessage('Error!', res.message);          
          //this.toast.onFail('Error in adding card');
        }
        this.isSubmitted = false;
      });
    } else {
      // this.toast.onWaring('Error in card data, please try to fill carefully!')
    }
  }

  onCancel() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  /* Email Error Msg's */
  getErrorMsg(): string {
    if (this.f.email?.hasError('required')) {
      return 'Card Number is required';
    } else if (this.f.secretPin?.hasError('required')) {
      return 'CVV is required';
    }
    return this.f.email?.hasError('email') ? 'Please Enter Valid Input' : '';
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

}
