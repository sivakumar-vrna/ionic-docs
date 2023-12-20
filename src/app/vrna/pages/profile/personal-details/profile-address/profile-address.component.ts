  import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
  import { FormGroup, FormBuilder, Validators } from '@angular/forms';
  import { ProfileService } from 'src/app/shared/services/profile.service';
  import { ToastWidget } from 'src/app/widgets/toast.widget';
  import { COUNTRIES_KEY, COUNTRY_KEY, OrchService } from 'src/app/vrna/services/ui-orchestration/orch.service';
  import { UserService } from 'src/app/shared/services/user.service';
  import { Storage } from '@capacitor/storage';
  import {EventsService} from 'src/app/shared/services/events.service';
import { environment } from 'src/environments/environment';


  @Component({
    selector: 'app-profile-address',
    templateUrl: './profile-address.component.html',
    styleUrls: ['./profile-address.component.scss']
  })
  export class ProfileAddressComponent implements OnInit {

    @ViewChild('address_line_2') address_line_2: any;
    @ViewChild('idInputArea') idInputArea: any;
    @ViewChild('id_input_state') id_input_state: any;
    @ViewChild('id_input_country') id_input_country: any;
    @ViewChild('id_input_zip') id_input_zip: any;
    @ViewChild('id_input_country_name') id_input_country_name: any;
    @ViewChild('id_opt_country', { static: false }) radioElement: ElementRef;
    @ViewChild('btnSaveAddress') id_savebtn:any;




    @Input() addressData: any;
    @Input() userId: number;
    isSubmitted = false;
    countries: any[] = [];
    location: string = '';
    currency: string = '';
    selectedCountryName: string = '';
    originalAddressData: any;
    
    
    @ViewChild('address_line_1') address_line_1: any;


    editable = false;
    addressForm: FormGroup = this.formBuilder.group({
      address1: [''],
      address2: [''],
      area: [''],
      state: [''],
      country: [''],
      zipcode: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/), Validators.maxLength(6)]],
      selectedCountryCode: ['']
    });

    onZipcodeInput(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      let inputValue = inputElement.value;
      inputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
      inputElement.value = inputValue;
      this.addressForm.patchValue({ zipcode: inputValue });
    }

    filteredCountries: any[] = [];
    showDropdown = false;

    public i18n_PageLabels = {
      address_addressline_1: 'Address Line 1',
      address_addressline_2: 'Address Line 2',
      address_area: 'Area',
      address_state : 'State',
      address_country : 'Country',
      address_zip: 'Postal Code',
      edit:'Edit',
      cancel:'Cancel',
      profile_save:'Save'      
    }
    public i18n_PageLabels_temp: any;

    constructor(
      private formBuilder: FormBuilder,
      private toast: ToastWidget,
      private profileService: ProfileService,
      private userService: UserService,
      private chRef: ChangeDetectorRef,
      private renderer: Renderer2,
      private eventsService: EventsService
    ) {
      this.i18n_PageLabels_temp = JSON.parse(JSON.stringify(this.i18n_PageLabels));

      //first time on page refresh // translate   
      this.eventsService.subscribe('i18n:layout', (locale) => {      
      this.userService.translateLayout(this.i18n_PageLabels, this.i18n_PageLabels_temp, 
        locale);
      });
    }

    keypressOnEdit(event:KeyboardEvent):void{
      if(event.key == 'ArrowRight'){
       event.stopPropagation();
       event.preventDefault();
      }
      if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        event.preventDefault();
      }
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        let elem = document.getElementById('tabAddress');
        elem.focus();

      }

    }

    keypressOnAddrLine1(event: KeyboardEvent): void {    
      if(event.key == 'ArrowDown' || event.key == 'Enter'){
        event.stopPropagation();
        this.idInputArea.setFocus();
      } 
      if(event.key == 'ArrowUp'){
        let elem:any;
        elem= document.getElementById('tabAddress');
        if(elem){
          event.stopPropagation();
          elem.focus();
          event.preventDefault();
        }
      } 
    }

    keypressOnAddrLine2(event: KeyboardEvent): void {    
      if(event.key == 'ArrowDown' || event.key == 'Enter'){
        event.stopPropagation();
        this.id_input_state.setFocus();
      }  
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        this.idInputArea.setFocus();
      } 
      if(event.key == 'ArrowUp'){
        let elem:any;
        elem= document.getElementById('tabAddress');
        if(elem){
          event.stopPropagation();
          elem.focus();
          event.preventDefault();
        }
      }                  
    }

    keypressOnState(event: KeyboardEvent): void {    
      if(event.key == 'ArrowDown' || event.key == 'Enter'){
        event.stopPropagation();
        this.id_input_zip.setFocus();      
      }
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        this.address_line_2.setFocus();
      }       
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        this.id_input_country.setFocus();
      }             
    }


    keypressOnAreaInput(event: KeyboardEvent): void {    
      if(event.key == 'ArrowDown' || event.key == 'Enter'){
        event.stopPropagation();
        this.id_input_country.setFocus();      
      }
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        this.address_line_1.setFocus();
      }
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        this.id_input_state.setFocus();
      }   
      if(event.key == 'ArrowLeft'){
        event.stopPropagation();
        this.address_line_2.setFocus();
      }
             
    }
    keypressOnCountry(event: KeyboardEvent): void {
     if (event.key == 'ArrowDown' || event.key == 'Enter') {
          event.stopPropagation();
          const elem = document.getElementById('opt_country_name_0');
          if (elem) {
              elem.focus();
              event.preventDefault();
            } else {
            if (event.key == 'ArrowDown') {
              const elem = document.getElementById('btnSaveAddress');
            if (elem) {
              event.stopPropagation();
              elem.focus();
              event.preventDefault();
            }}
        }
      } else if (event.key == 'ArrowUp') {
          event.stopPropagation();
          this.idInputArea.setFocus();
      } else if (event.key == 'ArrowLeft') {
          event.stopPropagation();
          this.id_input_state.setFocus();
      } else if (event.key == 'ArrowRight') {
          event.stopPropagation();
          this.id_input_zip.setFocus();
      }
  }
  

    keypressOnRadiogroup(event: KeyboardEvent,selectedCountry: any): void {  
      if (event.key === 'Enter') {
        event.stopPropagation();
        this.addressForm.patchValue({
          selectedCountryCode: selectedCountry.countryCode,
          country: selectedCountry.country_name,
        });
        this.showDropdown = false;
        this.id_input_zip.setFocus();
        event.preventDefault();
      }
    
      if(event.key == 'ArrowLeft'|| event.key == 'ArrowRight'){
        event.stopPropagation();
        this.id_input_country.setFocus();      
      }   
     
    }
  
    

    keypressOnZip(event: KeyboardEvent): void {    
      if(event.key == 'Enter' || event.key == 'ArrowDown'){
        event.stopPropagation();
        let elem = document.getElementById('btnSaveAddress');
        elem.focus();
      }
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        this.id_input_state.setFocus();  
      }   
      if(event.key == 'ArrowRight'){
        event.stopPropagation();
        event.preventDefault();
      }
               
    }
    keypressOnOption(event:KeyboardEvent):void{
      if(event.key == 'ArrowUp'){
        event.stopPropagation();
        this.id_input_country.setFocus();
      }
    }
  


    async ngOnInit() {
      this.originalAddressData = { ...this.addressData };
      this.patchForm();
      this.addressForm.disable();
      this.countries = JSON.parse((await Storage.get({ key: COUNTRIES_KEY }))?.value);
      this.countries.sort((a, b) => a.country_name.localeCompare(b.country_name));
      this.location = (await Storage.get({ key: COUNTRY_KEY })).value;
      this.userId = await this.userService.getUserId();
    }

    async ngAfterViewInit() {
      let user_locale = environment.user_locale;  
      this.userService.translateLayout(this.i18n_PageLabels, this.i18n_PageLabels_temp, 
        user_locale);
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
      this.chRef.detectChanges();
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

      try {
        const res = await (await this.profileService.updateProfile(data)).toPromise();
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          // this.toast.onSuccess(res.message);

          this.addressData = data;
          this.patchForm();       
        
        } else {
          // this.toast.onFail('Error in the request');
        }

        let elem = document.getElementById('btnEditAddress');
        elem.focus();

        this.chRef.detectChanges();

      } catch (err) {
        // this.toast.onFail('Network Error');

        let elem = document.getElementById('btnEditAddress');
        elem.focus();

      } finally {
        this.isSubmitted = false;
        this.isEditable();
        this.showDropdown = false;

        let elem = document.getElementById('btnEditAddress');
        elem.focus();
      }
    }

    isEditable() {
      this.editable = !this.editable;
      if (this.editable) {
        this.addressForm.enable();

        setTimeout(() => {
          this.address_line_1.setFocus();
        }, 300);

      } else {
        this.addressForm.disable();
        this.showDropdown = false;

        setTimeout(() => {
          let elem = document.getElementById('btnEditAddress');
          elem.focus();
        }, 300);
        
      }
    }

    isClosetable() {
      if (this.editable) {
        this.editable = false;
        this.addressForm.disable();
        this.showDropdown = false;
        this.patchForm();
        //this.address_line_1.setFocus();
      }

      setTimeout(() => {
        let elem = document.getElementById('btnEditAddress');  
        if(elem){
          elem.focus();
        }
      }, 150);
      
    }

    onSearchInputChange(event: any) {
      const searchTerm = event.target.value.toLowerCase();
      this.filteredCountries = this.countries.filter(country =>
        country.country_name.toLowerCase().includes(searchTerm)
      );
      this.showDropdown = this.filteredCountries.length > 0;
    }

    onCountryRadioSelect(selectedCountry: any) {
      this.addressForm.patchValue({
        selectedCountryCode: selectedCountry.countryCode,
        country: selectedCountry.country_name,
      });

      this.showDropdown = false;
      const inputElement = document.querySelector('ion-input');
      if (inputElement) {
        inputElement['value'] = this.getSelectedCountryName();
      }
      this.showDropdown = false;
    }

    getSelectedCountryName(): string {
      const countryCode = this.addressForm.get('selectedCountryCode')?.value;
      const selectedCountry = this.countries.find(country => country.countryCode === countryCode);
      return selectedCountry ? selectedCountry.country_name : '';
    }
  }
