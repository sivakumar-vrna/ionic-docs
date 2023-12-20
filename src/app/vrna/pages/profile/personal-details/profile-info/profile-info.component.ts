  import { Component, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
  import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
  import { ProfileService } from 'src/app/shared/services/profile.service';
  import { ToastWidget } from 'src/app/widgets/toast.widget';
  import { environment } from 'src/environments/environment';
  import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
  import { HttpClient,HttpHeaders, HttpRequest } from '@angular/common/http';  
  import { catchError, map, tap } from 'rxjs/operators';
  import {EventsService} from 'src/app/shared/services/events.service';
  import { UserService } from 'src/app/shared/services/user.service';

  interface UploadImage {
    status: string;
    data?: {
       uploadUrl: string, 
       s3Path: string,   
       file?: File; 
         }; 
    message?: string;
    error?: any;
    statusCode?: number;
  }

  @Component({
    selector: 'app-profile-info',
    templateUrl: './profile-info.component.html',
    styleUrls: ['./profile-info.component.scss']
  })
  export class ProfileInfoComponent implements OnInit {
    @ViewChild('fileInput', { static: false }) fileInput: any;
    @ViewChild('inputFirstName') inputFirstName: any;
    @ViewChild('inputMiddleName') inputMiddleName: any;
    @ViewChild('inputLastName') inputLastName: any;
    @ViewChild('inputDob') inputDob: any;
    @ViewChild('inputMobile') inputMobile: any; 
    @ViewChild('inputNationality') inputNationality: any;

    @Input() userId: number;
    @Input() personalData: any;

    profileInfoForm: FormGroup;
    genderList = ['male', 'female', 'unknown'];
    userImage: SafeUrl;
    maxDate: string;
    profile_update_saved: boolean = false;
    selectedImage: File | null = null;

    public i18n_PageLabels = {
      profile_fname: 'First Name',
      profile_mname: 'Middle Name',
      profile_lname: 'Last Name',
      profile_gender : 'Gender',
      profile_dob : 'Date of Birth',
      profile_phone: 'Phone',
      profile_nationality:'Nationality',
      profile_change_photo:'Change Photo',
      profile_update_photo: 'Update Photo',
      profile_save:'Save',
      gender_female:'Female',
      gender_male:'Male',
      gender_unknown:'Unknown'
    }
    public i18n_PageLabels_temp: any;

    constructor(
      private profileService: ProfileService,
      private toast: ToastWidget,
      private formBuilder: FormBuilder,
      private sanitizer: DomSanitizer,
      private chRef: ChangeDetectorRef,
      private httpClient: HttpClient,
      public eventsService: EventsService,
      private userService: UserService,

    ) {

      this.i18n_PageLabels_temp = JSON.parse(JSON.stringify(this.i18n_PageLabels));

      //first time on page refresh // translate   
      this.eventsService.subscribe('i18n:layout', (locale) => {      
      this.userService.translateLayout(this.i18n_PageLabels, this.i18n_PageLabels_temp, 
        locale);      
      });

      this.createForm();
      this.setMaxDate();
    }

    keypressOnChangePhoto(event: KeyboardEvent): void {    
      if(event.key == 'ArrowDown'){
        event.stopPropagation();
        let elem = document.getElementById('btnRemovePhoto');
        elem.focus();
        this.chRef.detectChanges();
      }
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        let elem = document.getElementById('tabPersonalDet');
        elem.focus();
        this.chRef.detectChanges();
      }
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        this.inputFirstName.setFocus();      
        this.chRef.detectChanges();
      }
      if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        event.preventDefault();
      }
    }

    keypressOnRemovePhoto(event: KeyboardEvent): void {    
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        let elem = document.getElementById('btnChangePhoto')
        elem.focus();
        this.chRef.detectChanges();
      }
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        this.inputFirstName.setFocus();      
      }   
      if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        event.preventDefault();
      } 
      if(event.key == 'ArrowDown'){
        event.stopPropagation();
        event.preventDefault();
      }
    }

    keypressOnFname(event: KeyboardEvent): void {    
      if(event.key == 'ArrowDown' || event.key == 'Enter'){
        event.stopPropagation();
        this.inputLastName.setFocus();      
      }
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        this.inputMiddleName.setFocus();      
      }      
      if (event.key == 'ArrowUp'){
       let elem:any;
        elem = document.getElementById('tabPersonalDet');
        if(elem){
          event.stopPropagation();
          elem.focus();
          event.preventDefault();
        }    
      }   
      if(event.key == 'ArrowLeft'){
        let elem:any;
        elem = document.getElementById('btnChangePhoto');
        if(elem){
          event.stopPropagation();
          elem.focus();
          event.preventDefault();
        }

      }
    }

    keypressOnLname(event: KeyboardEvent): void {    
      if(event.key == 'ArrowDown' || event.key == 'Enter'){
        event.stopPropagation();
        this.inputDob.setFocus();
      }
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        this.inputFirstName.setFocus();
      }
      if(event.key == 'ArrowRight'){
          event.stopPropagation();
          const elemGenre = document.getElementById('input_gender');
          if (elemGenre) {
            elemGenre.focus();
            elemGenre.classList.add('highlighted'); 
          }      
          event.preventDefault();
          elemGenre.addEventListener('blur', () => {
          elemGenre.classList.remove('highlighted'); 
        });
       }
       if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        this.inputMiddleName.setFocus();
       }
      }

    keypressOnDob(event: KeyboardEvent): void {    
      if(event.key == 'ArrowDown' || event.key == 'Enter'){
        event.stopPropagation();
        this.inputNationality.setFocus();
        event.preventDefault();
      }    
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        this.inputLastName.setFocus();
        event.preventDefault();
      }
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        this.inputMobile.setFocus();
        event.preventDefault();
      }
      if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        const elemGenre = document.getElementById('input_gender');
        if (elemGenre) {
          elemGenre.focus();
          elemGenre.classList.add('highlighted'); 
        }      
        event.preventDefault();
        elemGenre.addEventListener('blur', () => {
        elemGenre.classList.remove('highlighted'); 
      });
      }
    }
    keypressOnNat(event: KeyboardEvent): void {    
      if(event.key == 'ArrowDown'){
        event.stopPropagation();
        event.preventDefault();
      }   
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        this.inputDob.setFocus();
      }
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        let elem = document.getElementById('btnSaveAll');
        elem.focus();
      }
      if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        this.inputMobile.setFocus();
      }
    }

    keypressOnMname(event: KeyboardEvent): void {    
     if (event.key == 'ArrowDown' || event.key == 'Enter') {
        event.stopPropagation();
        const elemGenre = document.getElementById('input_gender');
        if (elemGenre) {
          elemGenre.focus();
          elemGenre.classList.add('highlighted'); 
        }      
        event.preventDefault();
        elemGenre.addEventListener('blur', () => {
        elemGenre.classList.remove('highlighted'); 
      });
    }
    if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        this.inputFirstName.setFocus();      
      }   
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        this.inputLastName.setFocus();      

      }         
    }
    
    
    keypressOnGender(event: KeyboardEvent): void {    
      if(event.key == 'ArrowDown'){
        event.stopPropagation();
        this.inputMobile.setFocus();
        event.preventDefault();
      }
      if(event.key == 'Enter' ){
        event.stopPropagation();
        let elem = document.getElementById('input_gender');
        elem.focus();
      }
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        this.inputMiddleName.setFocus();
        event.preventDefault();
      }
      if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        this.inputLastName.setFocus();
        event.preventDefault();
      }
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        this.inputDob.setFocus();
      }
    }

    keypressOnPhone(event: KeyboardEvent): void {    
      if(event.key == 'ArrowDown' || event.key == 'Enter'){
        event.stopPropagation();
        let elem = document.getElementById('btnSaveAll');
        elem.focus();
        event.preventDefault();
      }
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        const elemGenre = document.getElementById('input_gender');
        if (elemGenre) {
          elemGenre.focus();
          elemGenre.classList.add('highlighted'); 
        }      
        event.preventDefault();
        elemGenre.addEventListener('blur', () => {
        elemGenre.classList.remove('highlighted'); 
      });
      }
      if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        this.inputDob.setFocus();
      }    
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        this.inputNationality.setFocus();
      }
    }
    keypressOnSaveBtn(event:KeyboardEvent):void{
      let elem:any;
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        this.inputMobile.setFocus();
      }
      if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        this.inputNationality.setFocus();
      }
      if(event.key == 'ArrowDown'){
        event.stopPropagation();
        event.preventDefault();
      }
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        event.preventDefault();
      }
     
    }

    async ngOnInit() {
      if(this.personalData.imageUrl != null){
        this.userImage = environment.cloudflareUrl+this.personalData.imageUrl;
      }else{
        if (localStorage.getItem('userImage')) {
          this.userImage = this.sanitizer.bypassSecurityTrustResourceUrl(localStorage.getItem('userImage'));
        } else {
          this.userImage = 'assets/images/profile-dummy.jpg';
        }
      }
      console.log("User Image>>>>>>>>>>>>"+this.userImage);
      await this.patchForm();
      //this.profileInfoForm.disable();
    }

    async ngAfterViewInit() {
      setTimeout(() => {
        let elem = document.getElementById('tabPersonalDet');      
        if(elem){
          elem.focus();
        }
      }, 1500);

      //translate static labels // on page loads
      let user_locale = environment.user_locale;  
      this.userService.translateLayout(this.i18n_PageLabels, this.i18n_PageLabels_temp, 
        user_locale);
    }

    createForm() {
      this.profileInfoForm = this.formBuilder.group({
        firstName: [{ value: '', disabled: false }],
        middleName: [''],
        lastName: [''],
        gender: [''],
        dob: ['', [this.dateValidator]],
        mobile: ['', [Validators.pattern('^[0-9]{10}$')]],
        nationality: [''],
        userImage: [''] ,
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
        nationality: this.personalData.nationality,
      });
    }


    get f() {
      return this.profileInfoForm.controls;
    }

    
    // dateValidator(control: FormControl) {
    //   const selectedDate = new Date(control.value);
    //   const currentDate = new Date();
      
    //   if (selectedDate > currentDate) {
    //     return { futureDate: true }; 
    //   }

    //   return null; 
    // }


    dateValidator(control: FormControl) {
      const value = control.value;
      if (!value) return null;
  
      const dateFormat = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!dateFormat.test(value)) {
        return { invalidDateFormat: true };
      }
  
      const [, day, month, year] = value.match(dateFormat);
      const dayInt = parseInt(day, 10);
      const monthInt = parseInt(month, 10);
      const yearInt = parseInt(year, 10);
  
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // Add 1 because months are zero-based
      const currentDay = currentDate.getDate();
  
      if (
        yearInt > currentYear ||
        (yearInt === currentYear && monthInt > currentMonth) ||
        (yearInt === currentYear && monthInt === currentMonth && dayInt > currentDay)
      ) {
        return { futureDate: true };
      }
  
      return null;
    }
  
  
    
    validateDate(event: any) {
      const dobControl = this.profileInfoForm.get('dob');
      if (dobControl.errors && dobControl.errors.futureDate) {
      dobControl.setValue(''); 
      }
      this.profile_update_saved = false;
    }

    setMaxDate() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because months are zero-based
      this.maxDate = `${month}/${year}`;
    }


  onEdit(controlName: string) {
    const control = this.profileInfoForm.get(controlName);
    if (control.disabled) {
      this[`${controlName}OriginalValue`] = control.value;
      control.enable();

      setTimeout(() => {
        const elem = document.getElementById(`input_${controlName}`);
        if(elem){
          elem.focus();
        }
      }, 300);
              
    } else {
      control.setValue(this[`${controlName}OriginalValue`]);
      control.disable();
    }
  }

  async onSubmitProfileForm(){

    console.log("onSubmitProfileForm");
    const data = {
      userId: this.userId,
      'firstName': this.profileInfoForm.value['firstName'],
      'middleName': this.profileInfoForm.value['middleName'],
      'lastName': this.profileInfoForm.value['lastName'],
      'gender': this.profileInfoForm.value['gender'],
      'dob': this.profileInfoForm.value['dob'],
      'mobile': this.profileInfoForm.value['mobile'],
      'nationality': this.profileInfoForm.value['nationality']
    };

    console.log("onSubmitProfileForm>>>>>>>>>>>"+this.profileInfoForm.value['firstName']);
    
    //this.profileInfoForm.get(controlName).disable();
    (await this.profileService.updateProfile(data)).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          // this.toast.onSuccess(res.message);
          this.profile_update_saved = true;
        } else {
          // this.toast.onFail('Error in the request');
        }
      }, (err: any) => {
        // this.toast.onFail('Network Error');
      }
    ) 

  }

    onFormChange(){
      this.profile_update_saved = false;
    }
    
    async onSubmit(controlName: string) {
      console.log("onSubmit");
      this.profile_update_saved = false;
      const data = {
        userId: this.userId,
        [controlName]: this.profileInfoForm.value[controlName],
      };
      (await this.profileService.updateProfile(data)).subscribe(
        (res: any) => {
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
            this.profile_update_saved = true;
          } else {
          }
        }, (err: any) => {
        }
      )
    }

    
    handleButtonClick() {
      const fileInput = document.getElementById('fileInput');
      fileInput?.click();
    }

  

    changeImage(event: any) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const dataURL = reader.result as string; 
          this.userImage = this.sanitizer.bypassSecurityTrustUrl(dataURL); 
          this.selectedImage = file; 
        };
        reader.readAsDataURL(file);
      }
    }
    
    async updateProfilePhoto() {
      if (this.selectedImage) { 
        try {
          const file: File = this.selectedImage; 
    
          // Step #1: Get the Upload URL
          const response: UploadImage = await (await this.profileService.getProfileImgUploadUrl()).toPromise();
    
          if (response && response.status === 'Success' && response.data && response.data.uploadUrl) {
            const uploadUrl = response.data.uploadUrl;
            const filePath = response.data.s3Path;
            console.log(filePath);
    
            // Step #2: Upload the file to the uploadUrl using HttpClient
            const uploadSuccess = await this.uploadFileToUrl(file, uploadUrl, filePath);
    
            if (uploadSuccess) {
              this.toast.onSuccess('Profile image updated successfully');
            } else {
              this.toast.onFail('Error uploading image');
            }
          } else {
            this.toast.onFail('Error getting upload URL');
          }
        } catch (error) {
          this.toast.onFail('An error occurred');
          console.error('Error:', error);
        }
      } else {
        this.toast.onFail('Please select an image to update');
      }
    }   
  
    uploadToPresignedUrl(url: string, file: File, path: string) {
      const headers = new HttpHeaders({'Content-Type': 'image/jpeg'});              
      this.httpClient.put(url, file, {headers}).subscribe(
        (response) => {
          console.log("File Uploaded");
          this.updatePathtoUser(path);
        },
        (error) => {
          console.log("error");
        }
      );
    }
    
    
    async uploadFileToUrl(file: File, uploadUrl: string, path: string): Promise<boolean> {
    try {
      this.uploadToPresignedUrl(uploadUrl, file, path);      
      return true;
    } catch (error) {
      console.error('Error in uploadFileToUrl:', error);
      return false;
    }
  }


  async updatePathtoUser(path: string){    
    const data = {
        userId: this.userId,
        'imageUrl': path
    };
    
    (await this.profileService.updateProfile(data)).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {                    
          console.log("Path updated to User");
        } else {          
        }
      }, (err: any) => {        
      }
    ) 

  }




  
  











  } 


