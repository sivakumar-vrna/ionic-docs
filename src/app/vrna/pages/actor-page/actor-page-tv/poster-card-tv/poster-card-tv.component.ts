import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from 'src/app/shared/services/error.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-poster-card-tv',
  templateUrl: './poster-card-tv.component.html',
  styleUrls: ['./poster-card-tv.component.scss'],
})
export class PosterCardTvComponent implements OnInit {

  @Input() cardData: any;
  @Input() posterHeight: string = '250px';
  @Input() carouselIndex: number;
  @Input() sectionName:string = '';
  @Input() movieId: number = 0;
  @Input() isActorPage: boolean = false;

  imageLoading: boolean = false;
  imageLoaded: boolean = false;
  imageUrl: string = "";
  imageLoadingUrl: string = "assets/images/movie-posters-placeholder.jpg";
  noImageUrl: string = "";
  effectiveDate: Date;
  isComing : boolean = false;
  userId: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private errorService: ErrorService
  ) { }

  async ngOnInit() {
    var diff: number;
    var diffDays: number;
    this.effectiveDate = this.cardData.effectiveDate;
    const now = Date();    
    diff = new Date(this.effectiveDate).getTime() - new Date(now).getTime();    
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    console.log("diffDaysdiffDaysdiffDaysdiffDays>>>>"+diffDays);
    if(diffDays > 0 && diffDays < 5){
      this.isComing = true;
    }

    this.userId = await this.userService.getUserId();
   }

  onCardClick() {
    //for guest user//
    if(isNaN(this.userId) || this.userId == null){
      this.errorService.showAlertMessage('Login Required!', 'Please login to continue.');
      return false;
    }

    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: {
          id: this.cardData.movieId
        },
        queryParamsHandling: 'merge',
      });
  }

  onImageLoaded() {
    this.imageLoaded = false;
  }

  handleEmptyImage() {
    this.imageLoading = false;
    this.imageUrl = this.noImageUrl;
  }
}
