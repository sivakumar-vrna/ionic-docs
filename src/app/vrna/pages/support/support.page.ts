import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonTextarea } from '@ionic/angular';
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
  uniquePageId: any;
  isMenuClosed = false;




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

  keypressOnbackbtn(event:KeyboardEvent){
    let elem:any;
    if(event.key === 'ArrowRight'){
      elem =  document.getElementById('btnMenuSupport_'+this.uniquePageId);
    }
    if (elem) {
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
    if(event.key == 'ArrowDown'){
      event.stopPropagation();
      this.support.setFocus();
    }
  }
  keypressOnMenubtn(event:KeyboardEvent){
    let elem:any;
    if(event.key === 'ArrowLeft'){
      elem = document.getElementById('btnbackSupport_'+this.uniquePageId);
    }
    if (elem) {
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
    if(event.key == 'ArrowDown'){
      event.stopPropagation();
      this.support.setFocus();
    }
    if (event.key === 'BackButton') {
      this.isMenuClosed = true;
      this.focusBtnsIfClosed();
    }
  }
  focusBtnsIfClosed() {
    const menuBtn = document.getElementById('btnMenuSupport_' + this.uniquePageId);
    const backBtn = document.getElementById('btnbackSupport_' + this.uniquePageId);
  
    if (this.isMenuClosed) {
      if (menuBtn) {
        menuBtn.focus();
        this.isMenuClosed = false;
      }
    } else {
      if (backBtn) {
        backBtn.focus();
        this.isMenuClosed = true;
      }
    }
  }
  keypressOnSupportBtn(event:KeyboardEvent):void{
    if(event.key == 'ArrowUp'){
      event.stopPropagation();
      this.support.setFocus();
      event.preventDefault();
    }
    
  }
   
  keypressOnNewline(event: KeyboardEvent, textarea: IonTextarea): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const currentValue = textarea.value;
      const newValue = currentValue + '\n';
      textarea.value = newValue;
      textarea.setFocus();
      this.supportForm.get('content').setValue(newValue);
    }
  }

 
  
  async ngOnInit() {
    console.time('Perf: Support Screen');
    this.userEmail = await this.userService.getEmail();

    this.uniquePageId = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.support.setFocus();
    }, 1500);
    console.timeEnd('Perf: Support Screen');
  }

  get f() {
    return this.supportForm.controls;
  }

  async onSubmit() {
    this.isSubmitted = true;
    this.isLoading = true;
    if (this.supportForm.valid) {
      const mailData = {
        mailId: this.userEmail,
        subject: `Message from ${this.userEmail}`,
        content: this.supportForm.value.content
      };
      (await this.supportService.reachUs(mailData)).subscribe((res) => {
        if (res.status.toLowerCase() === 'success') {
          this.mailResponse = res.message;
          setTimeout(() => {
            let firstElem= document.getElementById('nextmsg');   
            if(firstElem){
              firstElem.focus();
            }
          },100 );
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
        // this.toast.onFail('Please enter value.');
      } else {
        // this.toast.onFail('Please enter minimum 25 charecters.');
      }
    }
  }

  onNewMsg() {
    this.mailResponse = null;
    this.isSubmitted = false;
    this.isLoading = false;
    this.onClear();
    setTimeout(() => {
      this.support.setFocus();
    }, 500);
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
