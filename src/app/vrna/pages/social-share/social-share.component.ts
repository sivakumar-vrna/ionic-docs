import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss'],
})
export class SocialShareComponent {
  @Input() movieId: number;
  movieDetails: any;
  isLoading = true;
  txtencoded: any;
  constructor(
    private modal: ModalController,
    private router: Router,
    private movieService: MovieService,
    private route: ActivatedRoute,
    ) { }
    
    closeModal() {
      this.modal.dismiss();
    }
  url = this.router.url;
  encoded = encodeURI(this.url);
  movie_title:any;
  share_text: string;

  getWhatsAppShareLink(): string {
    //const urlToShare = this.encoded;
    //const message = 'Hey! Check out this amazing movie on VRNA'+"\n" +this.movie_title +' is now playing at ' + urlToShare;
    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(this.share_text)}`;
    return whatsappLink;
  }

  keypressOnSocialBtn(event: KeyboardEvent, idVal:any): void {
    let elem: any;
    if(event.key == 'ArrowLeft'){
      if(idVal > 1){
        elem = document.getElementById('btn-'+(idVal-1));
      }
    }  
    if(event.key == 'ArrowRight'){
      if(idVal < 5){
        elem = document.getElementById('btn-'+(idVal+1));
      }     
    }
    
    if(elem){
      event.stopPropagation();
      elem.focus();

    }
  }

  ngOnInit() {    

    if(this.movieId){
      this.onGetMovieDetail(this.movieId);
    }else{
      this.route.queryParams.subscribe((params) => {
        const movieId = params.id;
        if(movieId){
          this.onGetMovieDetail(movieId);
        }     
      });
    }
       
  }

  ngAfterViewInit() {

    setTimeout(() => {
      let elemFirst = document.getElementById('btn-1');
      if(elemFirst){
        elemFirst.focus();
      }
    }, 500);

  }

  async onGetMovieDetail(movieId) {
    (await this.movieService.getMovieDetail(movieId)).subscribe(async response => {
      if (response.status.toLowerCase() === 'success' && response.statusCode == 200) {
        this.movieDetails = response.data;
        this.txtencoded = encodeURIComponent(this.movieDetails.moviename);
        this.isLoading = false;

        this.url = environment.baseUrl + '/#/movie/' + this.movieDetails.movieId;
        this.encoded = encodeURI(this.url);
        this.movie_title = this.txtencoded;

        this.share_text = encodeURIComponent('Hey! Check out this amazing movie on VRNA Plex!'+"\n" + 
          this.movie_title +' is now playing at ' + this.url);

      } else {
        this.isLoading = false;
      }
    });
  }
  
  
}
