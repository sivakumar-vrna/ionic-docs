import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { isPlatform, ModalController } from '@ionic/angular';
import { from, Observable } from 'rxjs';
import { Http } from '@capacitor-community/http';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { FullscreenPage } from '../fullscreen/fullscreen.page';
import { Capacitor } from '@capacitor/core';
import { WebPlayerComponent } from '../web-player/web-player.component';
import { PlayerComponent } from '../player.component';
import { Movie } from 'src/app/shared/models/movie';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { HttpService } from 'src/app/shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  baseUrl = environment.vrnaFlowUrl;
  cookie$: Observable<any>;
  platform: string = null;
  playerComponent: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public modalController: ModalController,
    private http: HttpClient,
    private httpService: HttpService,
    private userService: UserService,
    private toast: ToastWidget
  ) {
    this.platform = Capacitor.getPlatform();
    console.log(this.platform);
  }

  onPlaying(url: string, data: any, continueWatch: boolean) {
    switch (this.platform) {
      case 'web': {
        this.onWebPlayer(url, data, false, continueWatch);
        break;
      }

      default: {
        this.onAndroidPlayer(url, data);
        break;
      }
    }
  }

  async onWebPlayer(url: string, data: any, isTrailer?: boolean, continueWatch?: boolean) {
    const options = {
      fluid: true,
      aspectRatio: '16:9',
      autoplay: true,
      preload: 'auto',
      sources: [{
        src: url,
        type: 'application/x-mpegURL',
      }],
      withCredentials: true,
    };
    const modal = await this.modalController.create({
      component: PlayerComponent,
      cssClass: 'vrna-web-player',
      componentProps: {
        contentData: data,
        options: options,
        isTrailer: isTrailer,
        continueWatch: continueWatch
      }
    });
    return await modal.present();
  }

  async onAndroidPlayer(url: string, data: any) {
    const sturl = null;
    const stlang = null;
    const stoptions = null;
    const modal = await this.modalController.create({
      component: FullscreenPage,
      cssClass: 'vrna-player',
      componentProps: {
        url: url,
        sturl: sturl,
        stlang: stlang,
        stoptions: stoptions,
        testApi: null,
        platform: this.platform
      }
    });
    return await modal.present();
  }

  async getMovieUrl(contentData: Movie, continueWatch: boolean) {
    const userId = await this.userService.getUserId();
    const url = this.baseUrl + 'getmovieurl' + `?userId=${userId}&movieId=${contentData?.movieId}`;
    const capacitorUrl = environment.capaciorUrl + url;

    (await this.httpService.getCall(url, capacitorUrl)).subscribe(
      async (res: any) => {
        if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
          const tempKey = res.data?.['CloudFront-Key-Pair-Id'];
          const tempPolicy = res.data?.['CloudFront-Policy'];
          const tempSign = res.data?.['CloudFront-Signature'];
          const tempCookie: any = `CloudFront-Key-Pair-Id=${tempKey}; CloudFront-Policy=${tempPolicy}; CloudFront-Signature=${tempSign}`;
          this.cookie$ = tempCookie;
          const url = isPlatform('capacitor') ? environment.capaciorUrl + res.data.URL : res.data.URL;
          console.log(url);
          this.onPlaying(url, contentData, continueWatch);
        } else {
          this.toast.onFail('Error in getting URL. Try Again');
        }
      })
  }

  async playTrailer(trailerUrl: any) {
    this.onWebPlayer(trailerUrl, null, true);
  }

  async playMovie(data: any, continueWatch?: boolean) {
    await this.getMovieUrl(data, continueWatch);
  }

  setCookie(cookieData: any) {
    const tempArray = cookieData.split(/(\s+)/);
    const domainUrl = this.document.location.hostname;
    tempArray.forEach(async element => {
      const tempCookie = element.split('=');
      switch (tempCookie[0]) {
        case 'CloudFront-Policy': {
          const options = {
            url: domainUrl,
            key: 'CloudFront-Policy',
            value: tempCookie[1].replace(/;/g, ""),
          };
          await Http.setCookie(options);
          break;
        }
        case 'CloudFront-Signature': {
          const options = {
            url: domainUrl,
            key: 'CloudFront-Signature',
            value: tempCookie[1].replace(/;/g, ""),
          };
          await Http.setCookie(options);
          break;
        }
        case 'CloudFront-Key-Pair-Id': {
          const options = {
            url: domainUrl,
            key: 'CloudFront-Key-Pair-Id',
            value: tempCookie[1].replace(/;/g, ""),
          };
          await Http.setCookie(options);
          break;
        }
      }
    });
  }

  // GET - HTTP call for capacitor and Web
  async getCall(url: string, capacitorUrl: string): Promise<Observable<any>> {
    const token = await this.userService.getCurrentToken();
    if (isPlatform('capacitor')) {
      const options = {
        url: capacitorUrl,
        headers: {
          'vrnaToken': token
        },
      };

      return from(Http.get(options)).pipe(
        tap(async (res) => {
          this.setCookie(res.headers['Set-Cookie']);
        }),
        map(result => result.data)
      );
    } else {
      return this.http.get<any>(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }


}
