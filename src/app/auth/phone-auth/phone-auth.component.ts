  import { Component,  EventEmitter, OnInit, Output } from '@angular/core';
  import { AuthService } from 'src/app/shared/services/auth/auth.service';
  import { Router } from '@angular/router';
  import firebase from 'firebase/compat/app';
  import "firebase/auth";
  import "firebase/firestore";




  @Component({
    selector: 'app-phone-auth',
    templateUrl: './phone-auth.component.html',
    styleUrls: ['./phone-auth.component.scss'],
  })
  export class PhoneAuthComponent implements OnInit {
    @Output() phoneVerified = new EventEmitter<void>();

    phoneNumber: any;
    reCaptchaVerifier: any;
    isSubmitted = false;


    constructor(
      private router: Router,
      private authService: AuthService
      ) {}



    ngOnInit() {
    }

    getOTP(){
      this.reCaptchaVerifier = new firebase.auth.RecaptchaVerifier
      ('sign-in-button',{size:'invisible'});

      firebase.auth().signInWithPhoneNumber(this.phoneNumber, this.reCaptchaVerifier).then
      (async (confirmationResult) => {
        localStorage.setItem('verificationId',JSON.stringify
        (confirmationResult.verificationId));
        await this.router.navigate(['/auth/code']);

        this.phoneVerified.emit();

      })
      .catch((error) => {
        alert(error.message);
        setTimeout(() => {
          (window as any).location.reload();
        }, 5000);
      });
    }
  }
