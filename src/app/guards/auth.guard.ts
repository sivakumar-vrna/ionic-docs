import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { UserService } from "../shared/services/user.service";
import { environment } from "src/environments/environment";
import { isPlatform } from "@ionic/core";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router
  ) { }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    let isAuthenticated = await this.userService.onAuth();

    if(!isPlatform('capacitor')){
      if((window as any).location.href.includes('/movie/')){
        isAuthenticated = true;
      }
    }

    if (!isAuthenticated) {     
      
      if(!isPlatform('capacitor')){
        //check if the url has a movie id      
        const movieId = route.queryParams.id;
        if(movieId){
          (window as any).location.href = environment.baseUrl + '/#/movie/' + movieId;
          return true;
        }
      }      

      this.router.navigateByUrl('/auth');
    }

    return isAuthenticated;
  }
}
