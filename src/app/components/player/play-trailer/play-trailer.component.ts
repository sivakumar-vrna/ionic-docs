import { Component, Input, OnInit } from '@angular/core';
import { isPlatform } from '@ionic/core';
import { PlayerService } from '../service/player.service';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/app/shared/services/error.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-play-trailer',
  templateUrl: './play-trailer.component.html',
  styleUrls: ['./play-trailer.component.scss'],
})
export class PlayTrailerComponent implements OnInit {
  @Input() contentData: any; 
  @Input() trailerUrl: string;
  domainUrl: string;
  @Input() movieId:number;
  @Input() uniquePageId:any;
  @Input() btnDesc:any;

  constructor(
    private playerService: PlayerService,
    private errorService: ErrorService,
    private userService: UserService
  ) { }

  ngOnInit() {
    console.time('Perf: CompnPlayerPlayTrailer Screen');
  }

  ngAfterViewInit() {
    console.timeEnd('Perf: CompnPlayerPlayTrailer Screen');
  }

  async onPlay() {

    let userId: any;
    userId = await this.userService.getUserId();

    //if no login session, then show an alert and return;
    if(isNaN(userId) || userId == null){
      this.errorService.showAlertMessage('Login Required!', 'Please login to continue.');
      return false;
    }


    if (isPlatform('capacitor')) {
      this.domainUrl = environment.cloudflareUrl;
    } else {
      this.domainUrl = (window as any).location.origin;
    }
    const url = this.domainUrl + '/' + this.trailerUrl;
    this.playerService.playTrailer(url,this.contentData);
  }
}
