import { Component, ElementRef, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { SwitchProfilesService } from '../switch-profiles/switch-profiles.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from 'src/app/shared/services/user.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { HttpClient,HttpHeaders, HttpRequest } from '@angular/common/http';  
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ErrorService } from 'src/app/shared/services/error.service';
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
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss'],
})

export class AddProfileComponent implements OnInit,AfterViewInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  selectedImage: File | null = null;  
  hide = true;
  userImage: SafeUrl;
  addProfileForm: FormGroup; 
  isLoading: boolean = false; 
  public inputValue: number;
  public containsRestrict: boolean = false;
  public NoRestrict: boolean = true;
  isAppLoading:any;
  optRestrict: any = '';

  public checkAge(): void {
    this.containsRestrict = this.inputValue < 18;
    this.NoRestrict = this.inputValue >= 18;
    this.optRestrict = '';
    if(this.inputValue){
      this.optRestrict = this.NoRestrict ? 'N' : 'Y';
    }
  }

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private switchProfile : SwitchProfilesService,
    private toast : ToastWidget,
    private sanitizer: DomSanitizer,
    private userService : UserService,
    private httpClient: HttpClient,
    private router : Router,
    private loadingCtrl: LoadingController,
    private errorService: ErrorService,
  ) { }


  keypressOnAddPwd(event: KeyboardEvent): void { 
    let elem: any;   
    if(event.key == 'ArrowRight'){
      elem = document.getElementById('Add_pwd_eye');
    }
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('btnSave');                  
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
    if(event.key == 'ArrowUp'){
      event.stopPropagation();
      const elemGenre = document.getElementById('Drop_opt');
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
  keyoressOnAge(event: KeyboardEvent): void { 
    if(event.key == 'ArrowDown'){
      event.stopPropagation();
      const elemGenre = document.getElementById('Drop_opt');
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
  keypressOnAddOpt(event: KeyboardEvent): void { 
    if(event.key == 'Enter'){
      event.stopPropagation();
      let elem = document.getElementById('Drop_opt')
      elem.focus();
    }
  }
  keypressOnaddbackbtn(event:KeyboardEvent):void{
    if (event.key === 'Enter') {
        setTimeout(() => {
          const elem = document.getElementById('managebtn');
          if (elem) {
            event.stopPropagation();
            elem.focus();
            event.preventDefault();
          }
        }, 600); 
      }
  }

  ngOnInit() {
    this.addProfileForm = this.formBuilder.group({
      userId: [''],
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      restricted: ['',[Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[0-9]{4}$')]],
      imageUrl: [''],
    });

    this.optRestrict = 'Restricted';


    //this.addProfileForm.controls.restricted.setValue("");

    //Add new form will have the photo-placehilder only
    this.userImage = 'assets/images/profile-dummy.jpg';

    /*
    if (localStorage.getItem('userImage')) {
      this.userImage = this.sanitizer.bypassSecurityTrustResourceUrl(localStorage.getItem('userImage'));
    } else {
      this.userImage = 'assets/images/profile-dummy.jpg';
    }
    */
  }

  async ngAfterViewInit() {
    setTimeout(() => {
      const firstElem = document.getElementById('Add_profile_input');
      if(firstElem){
        firstElem.focus();
      }
    }, 2000);
    console.timeEnd('Perf: Login Screen');
  }

  
  async updatePathtoProfile(path: string, profileId: number){    
    const data = {        
        profileId: profileId,
        'imageUrl': path
    };
    
    (await this.profileService.updateUserProfile(data)).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          console.log("Path updated to User");
          this.toast.onSuccess('User profile is added');
          this.router.navigateByUrl("/switch-profiles");
          //window.location.reload();
        } else {          
        }
      }, (err: any) => {        
      }
    )
  }

  uploadToPresignedUrl(url: string, file: File, path: string, profileId: number) {
    const headers = new HttpHeaders({'Content-Type': 'image/jpeg'});              
    this.httpClient.put(url, file, {headers}).subscribe(
      (response) => {
        console.log("File Uploaded");
        this.updatePathtoProfile(path, profileId);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  async uploadFileToUrl(file: File, uploadUrl: string, path: string, profileId: number ): Promise<boolean> {
    try {
      this.uploadToPresignedUrl(uploadUrl, file, path, profileId);      
      return true;
    } catch (error) {
      console.error('Error in uploadFileToUrl:', error);
      return false;
    }
  }

  async updateProfilePhoto(profileId:number) {
    if (this.selectedImage) { 
      try {
        const file: File = this.selectedImage; 
  
        // Step #1: Get the Upload URL
        const response: UploadImage = await (await this.profileService.getUserProfileImgUploadUrl()).toPromise();
  
        if (response && response.status === 'Success' && response.data && response.data.uploadUrl) {
          const uploadUrl = response.data.uploadUrl;
          const filePath = response.data.s3Path;
          console.log(filePath);
  
          // Step #2: Upload the file to the uploadUrl using HttpClient
          const uploadSuccess = await this.uploadFileToUrl(file, uploadUrl, filePath, profileId);
  
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
      //this.toast.onFail('Please select an image to update');  
      //photo is not mandatory//    
    }
  }   

  get f() {
    return this.addProfileForm.controls;
  }

  async onSubmit() {
    if (this.addProfileForm.valid) {

      try{    
        this.isAppLoading = await this.loadingCtrl.create({
          cssClass: 'my-custom-class',
          message: 'Please wait ...',
        });
        await this.isAppLoading.present();
      } catch(err){}

      const data = {
        userId: await this.userService.getUserId(),
        name: this.addProfileForm.controls.name.value,
        age: this.addProfileForm.controls.age.value,
        restricted: this.addProfileForm.controls.restricted.value==="N"?false:true,
        password: this.addProfileForm.controls.password.value
        //imageUrl: this.addProfileForm.controls.imageUrl.value
      };
      (await this.switchProfile.addProfile(data)).subscribe(res => {
        if (res?.status?.toLowerCase() === 'success' && res?.statusCode == 200) {          
            var profileId = res.data.profileId;
            console.log("profileIdprofileIdprofileIdprofileId>>>"+profileId);
            this.updateProfilePhoto(profileId);            
            this.isAppLoading.dismiss();
            this.router.navigateByUrl("/switch-profiles");
        } else {
          this.toast.onFail('Error');
          this.isAppLoading.dismiss();
        }
      });
    } else {

      /*

      //debug
      Object.keys(this.addProfileForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.addProfileForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
           console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });

      */

      //show form validation error message to the user to correct
      this.errorService.showAlertMessage('Error', 'Form is not valid');


      //this.toast.onFail('Form is not valid');
    }
  }

  selectImage() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
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
}
