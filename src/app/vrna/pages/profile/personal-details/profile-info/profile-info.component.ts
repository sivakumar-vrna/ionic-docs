import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {
  @Input() userId: number;
  @Input() personalData: any;

  profileInfoForm: FormGroup;
  genderList = ['male', 'female', 'unknown'];
  userImage: SafeUrl;
  constructor(
    private profileService: ProfileService,
    private toast: ToastWidget,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.createForm();
  }

  async ngOnInit() {
    console.log(this.personalData);
    if (localStorage.getItem('userImage')) {
      this.userImage = this.sanitizer.bypassSecurityTrustResourceUrl(localStorage.getItem('userImage'));
    } else {
      this.userImage = 'assets/images/profile-dummy.jpg';
    }
    await this.patchForm();
    this.profileInfoForm.disable();
  }

  createForm() {
    this.profileInfoForm = this.formBuilder.group({
      firstName: [{ value: '', disabled: false }],
      middleName: [''],
      lastName: [''],
      gender: [''],
      dob: [''],
      mobile: ['', [Validators.minLength(10), Validators.pattern('^[0-9]*$')]],
      nationality: ['']
    });
  }

  async patchForm() {
    this.profileInfoForm.patchValue({
      firstName: this.personalData.firstName,
      middleName: this.personalData.middleName,
      lastName: this.personalData.lastName,
      gender: this.personalData.gender,
      dob: this.personalData.dob,
      mobile: this.personalData.mobile,
      nationality: this.personalData.nationality
    });
  }


  get f() {
    return this.profileInfoForm.controls;
  }

  onEdit(controlName: string) {
    if (this.profileInfoForm.get(controlName).disabled) {
      this.profileInfoForm.get(controlName).enable();
    } else {
      this.profileInfoForm.get(controlName).disable();
    }
  }

  async onSubmit(controlName: string) {
    const data = {
      userId: this.userId,
      [controlName]: this.profileInfoForm.value[controlName],
    };
    console.log(data);
    this.profileInfoForm.get(controlName).disable();
    (await this.profileService.updateProfile(data)).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          this.toast.onSuccess(res.message);
        } else {
          this.toast.onFail('Error in the request');
        }
      }, (err: any) => {
        this.toast.onFail('Network Error');
      }
    )
  }
}
