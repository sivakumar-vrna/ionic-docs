import { Component, Input, OnInit } from '@angular/core';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { RatingService } from './rating.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  @Input() userRating: number;
  @Input() movieId: number;
  
  constructor(
    private ratingService: RatingService,
    private toast: ToastWidget
  ) { }

  ngOnInit() {}

  async onSubmit(rating) {
    (await this.ratingService.rateMovie(this.movieId, rating)).subscribe((res: any) => {
      if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
        this.toast.onSuccess(res.message);
      } else {
        this.toast.onFail('Error in saving detail');
      }
    }, (err) => {
      this.toast.onFail('Error in network');
    })
  }
}
