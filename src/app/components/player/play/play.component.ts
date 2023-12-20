import { Component, Input, OnInit } from '@angular/core';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { PlayerService } from '../service/player.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit {
  @Input() contentData: any;
  @Input() isTrailer: boolean;
  @Input() isContinueWatch: boolean;
  @Input() movieUrl: any;

  options: any

  constructor(
    private playerService: PlayerService,
    private toast: ToastWidget
  ) { }

  ngOnInit() {
    console.time('Perf: CompnPlayerPlay Screen');

    this.options = {
      fluid: true,
      aspectRatio: '16:9',
      autoplay: true,
      preload: 'auto',
      sources: [{
        src: this.movieUrl,
        type: 'application/x-mpegURL',
      }],
      withCredentials: true,
    }
  }

  ngAfterViewInit() {
    console.timeEnd('Perf: CompnPlayerPlay Screen');
  }
}
