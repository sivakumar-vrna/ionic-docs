import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { isPlatform, ModalController } from "@ionic/angular";
import { BehaviorSubject, from, Observable } from "rxjs";
import { Http } from "@capacitor-community/http";
import { UserService } from "src/app/shared/services/user.service";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { DOCUMENT } from "@angular/common";
import { FullscreenPage } from "../fullscreen/fullscreen.page";
import { Capacitor } from "@capacitor/core";
import { PlayerComponent } from "../player.component";
import { Movie } from "src/app/shared/models/movie";
import { ToastWidget } from "src/app/widgets/toast.widget";
import { HttpService } from "src/app/shared/services/http.service";

@Injectable({
  providedIn: "root",
})
export class PlayerService {
  baseUrl = environment.vrnaFlowUrl;
  cookie$: Observable<any>;
  platform: string = null;
  playerComponent: any;

  private continueSubject = new BehaviorSubject<string | null>(null);
  continue_update$ = this.continueSubject.asObservable();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public modalController: ModalController,
    private http: HttpClient,
    private httpService: HttpService,
    private userService: UserService,
    private toast: ToastWidget
  ) {
    this.platform = Capacitor.getPlatform();
  }

  onPlaying(url: string, data: any, continueWatch: boolean, pauseTime: number) {
    switch (this.platform) {
      case "web": {
        this.onWebPlayer(url, data, false, continueWatch, pauseTime);
        break;
      }

      default: {
        //checking video crash issue with android player; replacing with videojs
        this.onWebPlayer(url, data, false, continueWatch, pauseTime);
        //this.onAndroidPlayer(url, data,currentTime);
        break;
      }
    }
  }

  async onWebPlayer(
    url: string,
    data: any,
    isTrailer?: boolean,
    continueWatch?: boolean,
    pauseTime?: number
  ) {
    //get the extension of the url
    let extn = url.split(".").pop();
    extn = extn.toLowerCase();
    let extn_arr = extn.split("?");
    extn = extn_arr[0];
    let mimetype = "application/x-mpegURL";
    if (extn == "mp4") {
      mimetype = "video/mp4";
    }

    const options = {
      fluid: true,
      aspectRatio: "16:9",
      autoplay: true,
      preload: "auto",
      fullscreen: true,
      sources: [
        {
          src: url,
          type: mimetype,
        },
      ],
      withCredentials: true,
      controlBar: {
        skipButtons: {
          backward: 10,
          forward: 5,
        },
      },
      userActions: {        
        hotkeys: function (event) {          
          // `this` is the player in this context
          if (event.key == "ArrowRight" || event.keyCode == 228) {
            let elem = document.getElementById("btnFF");
            if (this.paused()) {
              event.stopPropagation();
              elem.focus();
              event.preventDefault();
            }else{
              event.stopPropagation();
              const currentTime = this.currentTime();
              this.currentTime(currentTime + 5);
              event.preventDefault();
            }
          }

          else if (event.key == "ArrowLeft" || event.keyCode == 227) {            
            let elem = document.getElementById("btnFF");
            if (this.paused()) {
              event.stopPropagation();
              elem.focus();
              event.preventDefault();
            } else {
              event.stopPropagation();
              const currentTime = this.currentTime();
              this.currentTime(currentTime - 10);
              event.preventDefault();
            }
          }

          else if (event.key == "ArrowUp" || event.keyCode == 447) {
            let elem = document.getElementById("btnFF");
            if (this.paused()) {
              event.stopPropagation();
              elem.focus();
              event.preventDefault();
            } else {
              event.stopPropagation();
              let curVolume = this.volume();
              this.volume(curVolume + 1);
              event.preventDefault();
            }
          }

          else if (event.key == "ArrowDown" || event.keyCode == 448) {
            console.log("ArrowDownArrowDownArrowDownArrowDownArrowDownArrowDownArrowDownArrowDownArrowDownArrowDownArrowDownArrowDownArrowDownArrowDownArrowDownArrowDown")
            let elem = document.getElementById("btnFF");
            if (this.paused()) {
              console.log("PausedPausedPausedPausedPausedPausedPausedPausedPausedPausedPausedPausedPausedPausedPausedPausedPausedPausedPausedPausedPausedPausedPaused")
              elem.focus();
            }else{              
              event.stopPropagation();
              let curVolume = this.volume();
              this.volume(curVolume - 1);
              event.preventDefault();
            }
          }          
          else if (event.key == "Enter" || event.keyCode == 179) {
            event.stopPropagation();
            if (this.paused()) {
              this.play();
            } else {
              this.pause();
            }
            event.preventDefault();
          }

          else if (event.key == 10009) {
            //remote back button
          }
        },
      },
    };    
    const modal = await this.modalController.create({
      component: PlayerComponent,
      cssClass: "vrna-web-player",
      componentProps: {
        contentData: data,
        options: options,
        isTrailer: isTrailer,
        continueWatch: continueWatch,
        watchPercent: pauseTime,
        videoUrl: url,
      },
    });
    return await modal.present();
  }

  async onAndroidPlayer(url: string, data: any) {
    const sturl = null;
    const stlang = null;
    const stoptions = null;
    const modal = await this.modalController.create({
      component: FullscreenPage,
      cssClass: "vrna-player",
      componentProps: {
        url: url,
        sturl: sturl,
        stlang: stlang,
        stoptions: stoptions,
        testApi: null,
        platform: this.platform,
      },
    });
    return await modal.present();
  }

  async getMovieUrl(contentData: Movie, continueWatch: boolean, pauseTime: number) {
    const userId = await this.userService.getUserId();
    const url =
      this.baseUrl +
      "getmovieurl" +
      `?userId=${userId}&movieId=${contentData?.movieId}`;
    const capacitorUrl = environment.capaciorUrl + url;

    (await this.httpService.getCall(url, capacitorUrl)).subscribe(
      async (res: any) => {
        if (res.status.toLowerCase() === "success" && res.statusCode == 200) {
          const expires = res.data?.["X-Amz-Expires"];
          const credential = res.data?.["X-Amz-Credential"];
          const signature = res.data?.["X-Amz-Signature"];
          console.log("expires>>>>>>>>>" + expires);
          console.log("credential>>>>>>>>>" + credential);
          console.log("signature>>>>>>>>>" + signature);
          const tempCookie: any = `X-Amz-Expires=${expires}; X-Amz-Credential=${credential}; X-Amz-Signature=${signature}`;
          this.cookie$ = tempCookie;
          // const url = isPlatform('capacitor') ? environment.cloudflareUrl + res.data.URL : environment.cloudflareUrl + res.data.URL;
          let url = res.data.signedUrl;

          //debugging with a sample multiple audio languages video url
          //url = 'https://dwpurpmwfzvap.cloudfront.net/videojs-for-github/master.m3u8';

          this.onPlaying(url, contentData, continueWatch, pauseTime);
        } else {
          // this.toast.onFail('Error in getting URL. Try Again');
        }
      }
    );
  }

  async playTrailer(trailerUrl: any, contentData: any) {
    this.onWebPlayer(trailerUrl, contentData, true);
  }

  async playMovie(data: any, continueWatch?: boolean, pauseTime?: number) {
    await this.getMovieUrl(data, continueWatch, pauseTime);
  }

  setCookie(cookieData: any) {
    const tempArray = cookieData.split(/(\s+)/);
    const domainUrl = this.document.location.hostname;
    tempArray.forEach(async (element) => {
      const tempCookie = element.split("=");
      switch (tempCookie[0]) {
        case "X-Amz-Expires": {
          const options = {
            url: domainUrl,
            key: "X-Amz-Expires",
            value: tempCookie[1].replace(/;/g, ""),
          };
          await Http.setCookie(options);
          break;
        }
        case "X-Amz-Signature": {
          const options = {
            url: domainUrl,
            key: "X-Amz-Signature",
            value: tempCookie[1].replace(/;/g, ""),
          };
          await Http.setCookie(options);
          break;
        }
        case "X-Amz-Credential": {
          const options = {
            url: domainUrl,
            key: "X-Amz-Credential",
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
    if (isPlatform("capacitor")) {
      const options = {
        url: capacitorUrl,
        headers: {
          vrnaToken: token,
        },
      };

      return from(Http.get(options)).pipe(
        tap(async (res) => {
          this.setCookie(res.headers["Set-Cookie"]);
        }),
        map((result) => result.data)
      );
    } else {
      return this.http.get<any>(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  get trailerBaseUrl() {
    if (isPlatform("capacitor")) {
      return environment.cloudflareUrl;
    } else {
      return (window as any).location.origin;
    }
  }

  setContinue_update(value: string) {
    localStorage.setItem("continue_has_update", value);
    this.continueSubject.next(value);
  }

  getContinue_update(): string | null {
    return localStorage.getItem("continue_has_update");
  }
}
