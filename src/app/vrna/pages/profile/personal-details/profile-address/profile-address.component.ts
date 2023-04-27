import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';

@Component({
  selector: 'app-profile-address',
  templateUrl: './profile-address.component.html',
  styleUrls: ['./profile-address.component.scss']
})
export class ProfileAddressComponent implements OnInit {
  @Input() addressData: any;
  @Input() userId: number;
  isSubmitted = false;

  countries: any[];
  editable = false;
  addressForm: FormGroup = this.formBuilder.group({
    address1: [''],
    address2: [''],
    area: [''],
    state: [''],
    country: [''],
    zipcode: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]*$')]]
  });
  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastWidget,
    private profileService: ProfileService
  ) {
    this.createForm();
  }

  async ngOnInit() {
    console.log(this.addressData);
    this.patchForm();
    this.addressForm.disable();
  }

  createForm() {

  }

  patchForm() {
    this.addressForm.patchValue({
      address1: this.addressData.address1,
      address2: this.addressData.address2,
      area: this.addressData.area,
      state: this.addressData.state,
      country: this.addressData.country,
      zipcode: this.addressData.zipcode
    });
  }

  get f() {
    return this.addressForm.controls;
  }

  async onSubmit() {
    this.isSubmitted = true;
    if (this.addressForm.invalid) {
      return false;
    }

    const data = {
      userId: this.userId,
      address1: this.f.address1.value,
      address2: this.f.address2.value,
      area: this.f.area.value,
      state: this.f.state.value,
      country: this.f.country.value,
      zipcode: this.f.zipcode.value
    };
    console.log(data);
    (await this.profileService.updateProfile(data)).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          this.toast.onSuccess(res.message);
        } else {
          this.toast.onFail('Error in the request');
        }
        this.isSubmitted = false;
        this.isEditable();
      }, (err: any) => {
        this.isSubmitted = false;
        this.toast.onFail('Network Error');
      }
    )
  }

  isEditable() {
    this.editable = !this.editable;
    if (this.editable) {
      this.addressForm.enable();
    } else {
      this.addressForm.disable();
    }
  }

}
