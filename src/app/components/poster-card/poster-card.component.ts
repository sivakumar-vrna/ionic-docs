import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-poster-card',
  templateUrl: './poster-card.component.html',
  styleUrls: ['./poster-card.component.scss'],
})
export class PosterCardComponent implements OnInit {

  @Input() cardData: any;
  @Input() posterHeight: string = '250px';

  imageLoading: boolean = false;
  imageLoaded: boolean = false;
  imageUrl: string = "";
  imageLoadingUrl: string = "assets/images/movie-posters-placeholder.jpg";
  noImageUrl: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() { }

  onCardClick() {
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
    console.log('image loaded');
    this.imageLoaded = false;
  }

  handleEmptyImage() {
    console.log('error in image loaded');
    this.imageLoading = false;
    this.imageUrl = this.noImageUrl;
  }
}
