import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  name: string;
  username: string;
  userImage: any;
  public menus = [
    { title: 'Home', url: '/home', icon: 'home-outline' },
    { title: 'Featured', url: '/view-category/featured', icon: 'bookmark-outline' },
    { title: 'Rented', url: '/view-category/rented', icon: 'film-outline' },
    { title: 'Watchlist', url: '/view-category/watchlist', icon: 'play-circle-outline' },
    { title: 'Latest', url: '/view-category/latest', icon: 'cloud-done-outline' },
    { title: 'Trending', url: '/view-category/trending', icon: 'diamond-outline' },
    { title: 'Top Movies', url: '/view-category/top', icon: 'easel-outline' },
    { title: 'Recommended', url: '/view-category/recommended', icon: 'flag-outline' },
    { title: 'My Transactions', url: '/transactions', icon: 'card-outline' },
    { title: 'Support', url: '/support', icon: 'help-circle-outline' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuControl: MenuController,
    private user: UserService
  ) { }

  async ngOnInit() {
    console.log(this.user)
    this.username = await this.user.getEmail();
    this.name = this.username.substring(0, this.username.lastIndexOf("@"));
    if (localStorage.getItem('userImage')) {
      console.log(localStorage.getItem('userImage'))
      this.userImage = localStorage.getItem('userImage')
    } else {
      this.userImage = 'https://ionicframework.com/docs/demos/api/list/avatar-han.png';
    }
  }


  async onLogout() {
    this.dismissSideMenu();
    await this.authService.logout();
  }

  dismissSideMenu() {
    this.menuControl.close();
  }
}
