import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { UserService } from "../shared/services/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router
  ) { }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    const isAuthenticated = await this.userService.onAuth();
    if (!isAuthenticated) {
      this.router.navigateByUrl('/auth');
    }
    return isAuthenticated;
  }
}
