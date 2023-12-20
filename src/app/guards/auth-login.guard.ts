import { Injectable } from "@angular/core";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { UserService } from "../shared/services/user.service";
import { Storage } from '@capacitor/storage';

@Injectable()
export class AuthLoginGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    const isAuthenticated = await this.userService.onAuth();
    if (isAuthenticated) {
      //check if an activation token presents in the url
      const token = route.queryParams.token;
      if(token && token != undefined){
        localStorage.clear();
        Storage.clear();
        this.router.navigate(['/auth/login'],
        {
          relativeTo: this.route,
          queryParams: route.queryParams,          
        });
        (window as any).location.reload();
        return false;        
      } else {
        this.router.navigate(['switch-profiles']);
      }
    }
    return !isAuthenticated;
  }
}