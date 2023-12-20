import { Component, OnInit, ViewChild } from '@angular/core';
import { isPlatform } from '@ionic/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {

  //for pagination
  public count = 0;
  public itemsPerPage = 4;
  public currentPage = 1;
  private first_li_page: any;
  @ViewChild('p') p: any;  


  transactionsDataSource: any;
  public currency: string; 


  constructor(
    private profileService: ProfileService,
    private errorService: ErrorService,
  ) { }  
  
  ngOnInit() {
    console.time('Perf: Transactions Screen');
    this.getTransactions();
    this.currency = localStorage.getItem('currency');
    if (this.currency === null) {
      this.currency = 'INR';
      localStorage.setItem('currency', this.currency);
    }
  }

  keypressOnPagination(event: KeyboardEvent): void {  
    let elem: any;  
  
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
    if(event.key == 'ArrowUp'){
      let elem = document.getElementById('"poster_img-0');
       if(elem){
       event.stopPropagation();
       elem.focus();
       event.preventDefault();
       }
    }
  }
  keypressOnMenu(event:KeyboardEvent){
    let elem: any;
    if (event.key === 'ArrowRight') {
      elem = document.getElementById('btnMenu');
    }
    if (elem) {
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }

  }

  ngAfterViewInit() {    

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
      
      this.first_li_page.focus();
    
    }, 2000);

    

    console.timeEnd('Perf: Transactions Screen');
  }

  async getTransactions() {
    (await this.profileService.getTransactions()).subscribe(
      (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          const tempData = res.data.reverse();
          this.transactionsDataSource = this.orchestrateData(tempData);
        } else {
          this.errorService.onError(res);
        }
      },
      (err: any) => {
        this.errorService.onError(err);
      }
    )
  }

  orchestrateData(data) {
    let tempData = [];
    if (data !== null && data[0]) {
      const tempMoviesList = data;
      tempMoviesList.map((trans: any) => {
        trans['posterImage'] = this.domainUrl + '/images' + trans.posterImage;
      });
      tempData = tempMoviesList;
      return tempData;
    } else {
      return null;
    }
  }

  doRefresh(event) {
    this.getTransactions();
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
