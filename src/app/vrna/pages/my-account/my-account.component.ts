import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { isPlatform } from '@ionic/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { environment } from 'src/environments/environment';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { DeviceInfoService } from 'src/app/shared/services/device-info/deviceInfo.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { map } from 'rxjs/operators';
import { pipe } from 'rxjs';

export const DEVICE_ID = 'deviceId';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {

  @ViewChild('p') p: any;
  private first_li_page: any;
  
  // deviceId: string;
  // userId: string;
  dateTime: string;
  browserInfo: string;
  selectedTab: string = 'audit';
  // currentPage: number = 1;
  totalPages: number = 10;
  userId: number;
  deviceId: number;
  selectedOption: boolean = false;
  itemList: any[] = [];
  uniquePageId:any;
  isMenuClosed = false;


  //for pagination
  public count = 0;
  public itemsPerPage = 10;
  public currentPage = 1;

  constructor(
    private profileService: ProfileService,
    private errorService: ErrorService,
    private getInfo: DeviceInfoService,
    private userService: UserService,
    private toast: ToastWidget,
    private deviceIn: DeviceInfoService,
    private chRef: ChangeDetectorRef
  ) {
    
  }

  keypressOnPagination(event: KeyboardEvent): void {    
    if(event.key == 'Enter'){
      event.stopPropagation();
      let elem = document.activeElement;
      let elem_id = elem.getAttribute('id');
      if(elem_id == 'page-id-0'){
        this.p.previous();
      }else  if(elem_id == 'page-id-next'){        
        let lastPageNum = this.p.getLastPage();
         if(this.currentPage != lastPageNum){
            this.p.next();
          }
      } else{
        let elem_id_num = elem_id.replace('page-id-', '');
        this.p.setCurrent(elem_id_num);   
      }
    }    
  }
  keypressOnDelBtn(event: KeyboardEvent, rowIndex:any): void {  
    let elem: any;  
    if(event.key == 'ArrowUp'){
      elem = document.getElementById('delbtn-'+(rowIndex-1));      
    }
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('delbtn-'+(rowIndex+1));
      if(!elem){
        this.first_li_page.focus();
      }
    }
    if(event.key == 'ArrowLeft'){
      elem = document.getElementById('primary_opt-'+rowIndex);           
    }    
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }

  keypressOnPrimaryOpt(event: KeyboardEvent, rowIndex:any): void {  
    let elem: any;  
    if(event.key == 'ArrowUp'){
      elem = document.getElementById('primary_opt-'+(rowIndex-1));      
    }
    if(event.key == 'ArrowDown'){
      elem = document.getElementById('primary_opt-'+(rowIndex+1));
      if(!elem){
        this.first_li_page.focus();
      }     
    }
    if(event.key == 'ArrowRight'){
      elem = document.getElementById('delbtn-'+rowIndex);           
    }    
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }

  keypressOnBackbtn(event:KeyboardEvent):void{
    let elem:any;
    if(event.key == 'ArrowRight'){
      elem =  document.getElementById('btnMenuAccount_'+this.uniquePageId);
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }
  keypressOnMenu(event:KeyboardEvent):void{
    let elem:any;
    if(event.key == 'ArrowLeft'){
      elem =  document.getElementById('accountBkBtn_'+this.uniquePageId);
    }
    if (event.key === 'BackButton') {
      this.isMenuClosed = true;
      this.focusBtnsIfClosed();
    }
   
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }
  focusBtnsIfClosed() {
    const menuBtn = document.getElementById('btnMenuAccount_'+this.uniquePageId);
    const backBtn = document.getElementById('accountBkBtn_'+this.uniquePageId);
  
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

  async ngOnInit() {
    console.time('Perf: MyAcount Screen');    
    this.userId = await this.userService.getUserId();

    // this.deviceId = '';
    // this.userId = '';
    this.dateTime = '';
    this.browserInfo = '';
    this.fetchData();
    this.fetchDeviceInfo(1);

    this.uniquePageId = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  }

  ngAfterViewInit() {
    

    setTimeout(() => {
      let elem = document.querySelector('ion-back-button');
      elem.focus();
    }, 2000);

    setTimeout(() => {

      const listItems = document.querySelectorAll('.ngx-pagination li');
      let link_id = 0;
      let lastPageNum = this.p.getLastPage();
      

      for (let i = 0; i <= listItems.length - 1; i++) {
        let elem_li = listItems[i] as HTMLElement;
        let clsname = elem_li.getAttribute('class');
        if(clsname != 'small-screen'){

          if(link_id == 1){
            this.first_li_page = elem_li;
          }
          
          let str_page_id = 'page-id-'+link_id;
          if(link_id == (lastPageNum+1)){
            str_page_id = 'page-id-next';
          }

          elem_li.setAttribute('id', str_page_id);
          elem_li.setAttribute('tabindex', '0');
          elem_li.className += " arrow-navigable";          

          link_id ++;
        }
      }
      
      // this.first_li_page.focus();
    
    }, 5000);

    console.timeEnd('Perf: MyAcount Screen');
  }

  // Function to fetch data from the API
  fetchData() {
    // this.apiService.getData(this.currentPage).subscribe(
    //   (response) => {
    //     // Update the itemList with the API response
    //     this.itemList = response.items;
    //     this.totalPages = response.totalPages;
    //   },
    //   (error) => {
    //     // Handle error
    //   }
    // );
  }

  async fetchDeviceInfo(i:any) {
    (await this.getInfo.getDeviceInfo()).subscribe(
      (res) => {
        this.itemList = res.data.reverse();
        this.chRef.detectChanges();
        // localStorage.setItem('device_data', JSON.stringify(this.itemList));

        setTimeout(() => {
          let elem = document.getElementById('primary_opt-'+i);
          if(elem){
            elem.focus();
          }
        }, 2000);
      },
      (err) => {
        setTimeout(() => {
          let elem = document.getElementById('primary_opt-'+i);
          if(elem){
            elem.focus();
          }
        }, 2000);
      }
    );
  }

  async onSubmit(devId:any, uID:any, primary:any, i:any) {
    const data = {
      deviceId: devId,
      userId: uID,
      primary: primary
    };
    (await this.deviceIn.updateDeviceInfo(data)).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          this.chRef.detectChanges();
          this.fetchDeviceInfo(i);
          // this.toast.onSuccess(res.message);
        } else {
          // this.toast.onFail('Error in the request');
        }

        //do it here//
        let elem = document.getElementById('primary_opt-'+i);
        if(elem){
          elem.focus();
        }

      }, (err: any) => {
        // this.toast.onFail('Network Error');
        let elem = document.getElementById('primary_opt-'+i);
        if(elem){
          elem.focus();
        }

      }
    )
  }

  async onDeleteDevice(e, i) {
    (await this.getInfo.removeDeviceInfo(e)).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          this.fetchDeviceInfo(i);

          setTimeout(() => {
            let elem = document.getElementById('accountBkBtn_'+this.uniquePageId);
            if(elem){
              elem.focus();
            }
          }, 1000);
          // this.toast.onSuccess('Device is removed successfully');
        }
      },
      (err) => {
        // this.toast.onFail('Error in network');
      }
    );
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  get domainUrl() {
    if (isPlatform('capacitor')) {
      return environment.capaciorUrl;
    } else {
      return (window as any).location.origin;
    }
  }

  //for pagination
  public onChange(event): void {
    console.dir(event);
    this.currentPage = event;
  }
}
