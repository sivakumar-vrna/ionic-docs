import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/shared/services/user.service';
import { DatePipe } from '@angular/common';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss'],
})
export class AddCardComponent implements OnInit {

  emailId: string;
  stripeCustId: string;
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
    private toast: ToastWidget
  ) {

  }

  async ngOnInit() {
    console.log(this.dateobj.getFullYear());
    this.userService.getEmail().then(res => this.emailId = res);
    this.userService.getStripeId().then(res => this.stripeCustId = res);
    this.cardForm();
    this.getSelectionYears();
  }

  getSelectionYears() {
    const years: any[] = [];
    const currentYear = this.dateobj.getFullYear();
    for (let i = 0; i < this.maxExpiryYear; i++) {
      years.push(currentYear + i);
    }
    this.selectYears = years;
    console.log(this.selectYears);
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
    const postData = {
      emailId: this.emailId,
      stripeCustId: this.stripeCustId,
      stripeCardId: null,
      cardNo: this.newCardForm.value.cardNo,
      expiryMonth: this.newCardForm.value.expiryMonth,
      expiryYear: this.newCardForm.value.expiryYear,
      secretPin: this.newCardForm.value.secretPin,
      stripetokenId: null,
      date: null
    }
    console.log(postData);
    if (this.newCardForm.valid) {

      (await this.cardService.addCard(postData)).subscribe(res => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          console.log(res);
          this.toast.onSuccess(res?.message);
          this.modalController.dismiss({
            'newcard': true
          });
        } else {
          this.toast.onFail('Error in adding card');
        }
        this.isSubmitted = false;
      });
    } else {
      this.toast.onWaring('Error in card data, please try to fill carefully!')
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
