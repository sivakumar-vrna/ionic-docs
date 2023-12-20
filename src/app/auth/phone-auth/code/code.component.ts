import { Component, OnInit, NgZone } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
})
export class CodeComponent implements OnInit {
  otp!: string;
  verify: any;
  isSubmitted = false;


  constructor(
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthService
  ) {}

  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };

  ngOnInit() {
    this.verify = JSON.parse(localStorage.getItem('verificationId') || '{}');
  }

  onOtpChange(otp: string) {
    this.otp = otp;
  }

  handleClick() {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      this.verify,
      this.otp
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(async (response) => {
        const userId = await this.authService.uniqueID(); 
        const macId = userId; 
  
        const registerData = {
          email: response.user.phoneNumber,
          macaddress: macId,
        };  
  
        
        localStorage.setItem('email', registerData.email);
  
        
        localStorage.setItem('registerData', JSON.stringify(registerData));
  
      
        this.router.navigate(['/auth/ph-pwd']);
      })
      .catch((error) => {
        alert(error.message);
      });
  }
  
}
