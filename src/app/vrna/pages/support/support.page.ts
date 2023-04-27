import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { supportService } from 'src/app/shared/services/support/support.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit, AfterViewInit {
  supportForm: FormGroup;
  isSubmitted = false;
  isLoading = false;
  mailResponse: string;
  userEmail: string;

  @ViewChild('support') support: any;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private supportService: supportService,
    private toast: ToastWidget,
  ) {
    this.supportForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.minLength(25)]],
    });
  }

  async ngOnInit() {
    this.userEmail = await this.userService.getEmail()
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.support.setFocus();
    }, 500);
  }

  get f() {
    return this.supportForm.controls;
  }

  async onSubmit() {
    this.isSubmitted = true;
    this.isLoading = true;
    console.log(this.supportForm.valid);
    if (this.supportForm.valid) {
      const mailData = {
        mailId: this.userEmail,
        subject: `Message from ${this.userEmail}`,
        content: this.supportForm.value.content
      };
      (await this.supportService.reachUs(mailData)).subscribe((res) => {
        if (res.status.toLowerCase() === 'success') {
          this.mailResponse = res.message;
        } else {
          this.isSubmitted = false;
          this.isLoading = false;
        }
      }, (err) => {
        this.isSubmitted = false;
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
      if (this.supportForm.value.content.length == 0) {
        this.toast.onFail('Please enter value.');
      } else {
        this.toast.onFail('Please enter minimum 25 charecters.');
      }
    }
  }

  onNewMsg() {
    this.mailResponse = null;
    this.isSubmitted = false;
    this.isLoading = false;
    this.onClear();
  }

  getContentErrorMsg() {
    if (this.f.content.hasError('required')) {
      return 'Content is Required';
    }
    return this.f.content.hasError('minLength') ? 'Min 25 characters' : '';
  }

  onClear() {
    this.supportForm.reset();
  }

}
