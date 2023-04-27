import { Component, Input, OnInit } from '@angular/core';
import { MovieDetailsService } from 'src/app/vrna/pages/movie-details/movie-details.service';
import { PlayerService } from '../player/service/player.service';

@Component({
  selector: 'app-continue-card',
  templateUrl: './continue-card.component.html',
  styleUrls: ['./continue-card.component.scss'],
})
export class ContinueCardComponent implements OnInit {

  @Input() cardData: any;

  percentageWatched: number;

  constructor(
    private player: PlayerService,
    private movieService: MovieDetailsService
  ) { }

  ngOnInit() { }

  onContinueWatch() {
    if (this.cardData.isRented) {
      this.player.playMovie(this.cardData, true);
    } else {
      this.movieService.movieDetailsModal(this.cardData.movieId);
    }
  }
}
