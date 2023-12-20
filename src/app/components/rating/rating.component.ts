import { Component, Input, OnInit } from '@angular/core';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { RatingService } from './rating.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  @Input() userRating: number;
  @Input() movieId: number;
  @Input() uniquePageId:any;
  
  constructor(
    private ratingService: RatingService,
    private toast: ToastWidget,
    private errorService: ErrorService,
    private userService: UserService,
  ) { }

  keypressOnStarRate(event: KeyboardEvent): void {
    let str_elemindex = document.activeElement.getAttribute('id');
    let elem: any;

    //get the number.
    let str_elemindex_part = str_elemindex.split('-');
    let elemindex: number = parseInt(str_elemindex_part[1]);

    if(event.key == 'ArrowLeft'){
      elem = document.getElementById('btn_star-'+(elemindex-1)+'-'+this.uniquePageId);
      if(!elem){
        elem = document.getElementById('btnPlayOrRent'+this.uniquePageId);
      }
    }
    if(event.key == 'ArrowRight'){
      elem = document.getElementById('btn_star-'+(elemindex+1)+'-'+this.uniquePageId);
      if(!elem){
        event.stopPropagation();
        event.preventDefault();
      }
    }
    if(event.key == 'ArrowUp'){
      event.stopPropagation();       
      elem = document.getElementById('BannerImg'+this.uniquePageId);      
      elem.focus();

      elem = document.getElementById('btnBack_Movie_detail'+this.uniquePageId);      
      elem.focus();

      event.preventDefault();
      
    }        
      if(event.key == 'ArrowDown'){
      elem =  document.getElementById('btnPlayOrRent'+this.uniquePageId)
    }

    if(elem && event.key != 'ArrowUp'){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();      
    }
  }

  

  ngOnInit() {}

  async onSubmit(rating) {

    //guest user
    let userId: any;
    userId = await this.userService.getUserId();
    if(isNaN(userId) || userId == null){
      this.errorService.showAlertMessage('Login Required!', 'Please login to continue.');
      return false;
    }

    (await this.ratingService.rateMovie(this.movieId, rating)).subscribe((res: any) => {
      if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
        // this.toast.onSuccess(res.message);
      } else {
        // this.toast.onFail('Error in saving detail');
      }
    }, (err) => {
      // this.toast.onFail('Error in network');
    })
  }
}
