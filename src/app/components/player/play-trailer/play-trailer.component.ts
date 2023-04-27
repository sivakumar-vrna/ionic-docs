import { Component, Input, OnInit } from '@angular/core';
import { isPlatform } from '@ionic/core';
import { environment } from 'src/environments/environment';
import { PlayerService } from '../service/player.service';

@Component({
  selector: 'app-play-trailer',
  templateUrl: './play-trailer.component.html',
  styleUrls: ['./play-trailer.component.scss'],
})
export class PlayTrailerComponent implements OnInit {

  @Input() trailerUrl: string;
  domainUrl: string;

  constructor(
    private playerService: PlayerService
  ) { }

  ngOnInit() {

  }

  onPlay() {
    console.log(this.trailerUrl);
    if (isPlatform('capacitor')) {
      this.domainUrl = environment.capaciorUrl;
    } else {
      this.domainUrl = window.location.origin;
    }
    const url = this.domainUrl + '/' + this.trailerUrl;
    console.log(url);
    this.playerService.playTrailer(url)
  }
}
